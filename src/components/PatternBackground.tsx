import { useEffect, useRef } from 'react'
import { createScene, type SceneSize } from './pattern/scene'

/**
 * "Drifting pattern" background (adapted from github.com/nuarthy/drifting-pattern):
 * soft-edged geometric windows drifting over the Hideout tile pattern, with a
 * pointer parallax on the wrapper.
 *
 * The drawing itself lives in `pattern/scene.ts` and normally runs in a worker
 * on an OffscreenCanvas, so a purely decorative animation costs the main
 * thread nothing. Browsers without OffscreenCanvas get one static frame drawn
 * in place — same look, no motion.
 */

// The canvas here paints at the same device-pixel density the main-thread
// version used; the fallback path below only draws one still frame, where a
// slightly softer render is a fair trade for skipping the animation entirely.
const FALLBACK_SCALE = 0.65

function measure(wrap: HTMLElement): SceneSize {
  return {
    width: wrap.clientWidth,
    height: wrap.clientHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  }
}

export function PatternBackground() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    // The effect owns its canvas. `transferControlToOffscreen` can only ever be
    // called once per element, and control never comes back, so a canvas that
    // outlives the effect throws on the next run — which is exactly what React's
    // dev-mode StrictMode does when it mounts effects twice. A fresh canvas per
    // run keeps the effect repeatable.
    const canvas = document.createElement('canvas')
    canvas.className = 'bg-pattern-canvas'
    wrap.appendChild(canvas)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const size = measure(wrap)

    let worker: Worker | undefined
    let observer: ResizeObserver | undefined

    if (typeof canvas.transferControlToOffscreen === 'function') {
      const offscreen = canvas.transferControlToOffscreen()
      worker = new Worker(new URL('./pattern/pattern.worker.ts', import.meta.url), { type: 'module' })
      worker.postMessage({ type: 'init', canvas: offscreen, size, pixelRatio: window.devicePixelRatio, reduceMotion }, [
        offscreen,
      ])
      observer = new ResizeObserver(() => {
        worker?.postMessage({ type: 'resize', size: measure(wrap) })
      })
      observer.observe(wrap)
    } else {
      // No OffscreenCanvas: draw a single frame here instead of animating.
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = Math.round(size.width * FALLBACK_SCALE)
        canvas.height = Math.round(size.height * FALLBACK_SCALE)
        createScene(ctx, {
          ...size,
          scale: FALLBACK_SCALE,
          makeCanvas: (width, height) => {
            const sprite = document.createElement('canvas')
            sprite.width = width
            sprite.height = height
            return sprite
          },
        }).drawStill()
      }
    }

    // Pointer parallax: the whole field eases towards the pointer. It is a CSS
    // transform on a composited layer, so it costs nothing per frame. The wrap
    // bleeds 80px so the shift never exposes an edge.
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 36
      const y = (e.clientY / window.innerHeight - 0.5) * 36
      wrap.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    }
    if (!reduceMotion) {
      window.addEventListener('pointermove', onMove, { passive: true })
    }

    return () => {
      worker?.terminate()
      observer?.disconnect()
      window.removeEventListener('pointermove', onMove)
      wrap.style.transform = ''
      canvas.remove()
    }
  }, [])

  return <div ref={wrapRef} className="bg-pattern-wrap" aria-hidden="true" />
}
