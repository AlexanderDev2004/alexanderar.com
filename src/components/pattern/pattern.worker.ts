/**
 * Dedicated worker that owns the animated background canvas.
 *
 * Everything expensive — building the blurred shape sprites, compositing the
 * reveal windows, the per-frame pattern fill — happens here, off the main
 * thread, so scrolling, hydration and Lighthouse's blocking-time budget never
 * pay for a purely decorative effect.
 */
import { createScene, type Scene, type SceneSize } from './scene'

type InitMessage = { type: 'init'; canvas: OffscreenCanvas; size: SceneSize; pixelRatio: number; reduceMotion: boolean }
type ResizeMessage = { type: 'resize'; size: SceneSize }

const scope = self as unknown as {
  addEventListener(type: 'message', listener: (event: MessageEvent<InitMessage | ResizeMessage>) => void): void
}

const FRAME_MS = 1000 / 30

let canvas: OffscreenCanvas | undefined
let scene: Scene | undefined
let timer: ReturnType<typeof setInterval> | undefined
let renderScale = 1

function fit(next: SceneSize) {
  if (!canvas) return
  canvas.width = Math.round(next.width * renderScale)
  canvas.height = Math.round(next.height * renderScale)
}

scope.addEventListener('message', (event) => {
  const message = event.data

  if (message.type === 'init') {
    canvas = message.canvas
    // Same pixel density as the pre-worker renderer (device pixels, capped at
    // 2x): this all happens here now, so sharpness costs the page nothing.
    renderScale = Math.min(message.pixelRatio || 1, 2)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    fit(message.size)
    scene = createScene(ctx, {
      ...message.size,
      scale: renderScale,
      makeCanvas: (width, height) => new OffscreenCanvas(width, height),
    })

    if (message.reduceMotion) {
      scene.drawStill()
      return
    }

    // Paint the first frame right away instead of waiting for the first timer
    // tick, so the background is never blank (and a throttled/frozen timer
    // cannot leave an empty canvas behind the content).
    scene.frame(performance.now())
    clearInterval(timer)
    timer = setInterval(() => scene?.frame(performance.now()), FRAME_MS)
    return
  }

  if (message.type === 'resize' && scene) {
    fit(message.size)
    scene.resize(message.size)
  }
})
