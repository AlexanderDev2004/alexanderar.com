/**
 * Drawing core for the drifting "Hideout pattern" background.
 *
 * Deliberately free of React, `document` and `window`: the same code runs
 * inside a dedicated worker on an OffscreenCanvas (the normal path, so the
 * per-frame work never touches the main thread) and on the main thread as a
 * one-off static frame when OffscreenCanvas is unavailable.
 *
 * The art: the Hideout tile (same 40px motif as before) is painted onto a
 * canvas, then revealed only inside soft-edged geometric "windows" — circles,
 * squares, pills, and polygons — that drift upward, steadily grow or shrink,
 * and slowly rotate. Each window carries a half-strength offset copy for
 * depth, and the tile slides diagonally on a seamless ~12s loop.
 */

export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
export type AnyCanvas = HTMLCanvasElement | OffscreenCanvas
export type MakeCanvas = (width: number, height: number) => AnyCanvas

const TILE = 40
const TILE_PATH_D =
  'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41z' +
  'M38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83-2.83-1.41-1.41L38.59 0H40v1.41z' +
  'M20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20' +
  'l-2.83-2.83 1.41-1.41L20 18.59z'

// Pattern color: warm tan, mid-way between the user's original soft tone
// rgba(226,218,201,0.8) and the too-dark rgba(202,190,165,0.85) — visible
// against the warm beige --bg (#e8e1d4) without harsh contrast.
const PATTERN_FILL = 'rgba(212, 202, 180, 0.82)'
const DRIFT_SECONDS = 12

// Soft-edged shape sprites: a white silhouette on transparent, so only the
// alpha matters — the sprite becomes the mask that reveals the pattern.
const SPRITE = 256
const BLUR = 7
// The depth copy keeps a tighter edge: a faint fill only reads as a separate
// layer if its outline is crisp enough to see where the alpha steps down.
const GHOST_BLUR = 2

const SHAPES = ['circle', 'square', 'rectangle', 'pill', 'triangle', 'pentagon', 'hexagon', 'octagon'] as const
type ShapeKind = (typeof SHAPES)[number]

function traceShape(s: Ctx2D, kind: ShapeKind, r: number) {
  s.beginPath()
  switch (kind) {
    case 'square':
      s.rect(-r, -r, r * 2, r * 2)
      break
    case 'rectangle':
      s.rect(-r, -r * 0.6, r * 2, r * 1.2)
      break
    case 'pill':
      s.roundRect(-r, -r * 0.42, r * 2, r * 0.84, r * 0.42)
      break
    case 'triangle':
    case 'pentagon':
    case 'hexagon':
    case 'octagon': {
      const sides = { triangle: 3, pentagon: 5, hexagon: 6, octagon: 8 }[kind]
      const start = kind === 'hexagon' ? 0 : -Math.PI / 2
      for (let i = 0; i < sides; i += 1) {
        const a = start + (i / sides) * Math.PI * 2
        const x = Math.cos(a) * r
        const y = Math.sin(a) * r
        if (i === 0) s.moveTo(x, y)
        else s.lineTo(x, y)
      }
      s.closePath()
      break
    }
    default:
      s.arc(0, 0, r, 0, Math.PI * 2)
  }
}

function makeSprite(makeCanvas: MakeCanvas, kind: ShapeKind, ramped: boolean, blur: number) {
  const sprite = makeCanvas(SPRITE, SPRITE)
  const s = sprite.getContext('2d') as Ctx2D
  s.translate(SPRITE / 2, SPRITE / 2)
  s.fillStyle = '#fff'
  // Blur softens the silhouette, so the pattern fades in across the rim
  // instead of stopping at a hard polygon edge.
  s.filter = `blur(${blur}px)`

  const R = SPRITE / 2 - BLUR * 2
  traceShape(s, kind, R)
  s.fill()

  if (!ramped) return sprite

  // Cut a long radial falloff into the silhouette: only the middle reaches
  // full opacity, the rest declines steadily. Ends at a residual rather than
  // zero, so polygon vertices keep their corners instead of becoming blobs.
  s.filter = 'none'
  s.globalCompositeOperation = 'destination-in'
  const ramp = s.createRadialGradient(0, 0, 0, 0, 0, R + BLUR)
  // Exact falloff from the original repo: a long, soft tail — that halo is
  // most of the drifting look.
  ramp.addColorStop(0, 'rgba(255, 255, 255, 1)')
  ramp.addColorStop(0.2, 'rgba(255, 255, 255, 0.93)')
  ramp.addColorStop(0.45, 'rgba(255, 255, 255, 0.82)')
  ramp.addColorStop(0.7, 'rgba(255, 255, 255, 0.65)')
  ramp.addColorStop(0.88, 'rgba(255, 255, 255, 0.56)')
  ramp.addColorStop(1, 'rgba(255, 255, 255, 0.42)')
  s.fillStyle = ramp
  s.beginPath()
  s.arc(0, 0, R + BLUR, 0, Math.PI * 2)
  s.fill()
  return sprite
}

// Hard size limits: a window that reaches one holds that size and keeps
// drifting; it never reverses, and it never pops out mid-screen.
const MIN_RADIUS = 90
const MAX_RADIUS = 260

// The wrap bleeds 80px past the viewport (CSS inset: -80px) so the pointer
// parallax never exposes an edge. Windows live in VIEWPORT coordinates — like
// the original demo — and are shifted by BLEED only when drawn, so seeding,
// recycling, and window counts match the original exactly.
const BLEED = 80

interface Particle {
  x: number
  y: number
  radius: number
  growth: number
  vx: number
  vy: number
  alpha: number
  phase: number
  sway: number
  swayRate: number
  rotation: number
  spin: number
  kind: ShapeKind
  sprite: AnyCanvas
  ghost: AnyCanvas
  ghostScale: number
  ghostTurn: number
  ghostOffset: number
}

export interface SceneSize {
  /** CSS size of the canvas element (viewport plus the parallax bleed). */
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
}

export interface SceneOptions extends SceneSize {
  /** Canvas pixels per CSS pixel. Below 1 on purpose: see RENDER_SCALE. */
  scale: number
  makeCanvas: MakeCanvas
}

export interface Scene {
  resize(next: SceneSize): void
  frame(nowMs: number): void
  drawStill(): void
}

export function createScene(ctx: Ctx2D, options: SceneOptions): Scene {
  const { scale, makeCanvas } = options

  let width = 0
  let height = 0
  let vw = 0
  let vh = 0
  let columns = 1
  let pattern: CanvasPattern | null = null
  const particles: Particle[] = []

  // Built lazily on first use: sprites need a canvas, and the module is also
  // imported during SSR where no canvas exists.
  let sprites: { kind: ShapeKind; sprite: AnyCanvas; ghost: AnyCanvas }[] | undefined
  const getSprites = () => {
    sprites ??= SHAPES.map((kind) => ({
      kind,
      sprite: makeSprite(makeCanvas, kind, true, BLUR),
      ghost: makeSprite(makeCanvas, kind, false, GHOST_BLUR),
    }))
    return sprites
  }

  function makePattern(): CanvasPattern {
    const tile = makeCanvas(Math.round(TILE * scale), Math.round(TILE * scale))
    const t = tile.getContext('2d') as Ctx2D
    t.scale(scale, scale)
    t.fillStyle = PATTERN_FILL
    t.fill(new Path2D(TILE_PATH_D), 'evenodd')
    const p = ctx.createPattern(tile as CanvasImageSource, 'repeat')!
    p.setTransform(new DOMMatrix([1 / scale, 0, 0, 1 / scale, 0, 0]))
    return p
  }

  function seedParticle(
    p: Particle,
    initial: boolean,
    index: number,
    total: number,
  ): Particle {
    // Radius 90-260px, square-skewed so most windows are mid-sized. Matches the
    // original: MIN_RADIUS + Math.random()**2 * 170.
    p.radius = MIN_RADIUS + Math.random() ** 2 * 170
    // Each window commits to one direction for its whole life: it only ever
    // grows or only ever shrinks. The sign is redrawn on recycle, never
    // mid-flight, so a window cannot pulse.
    p.growth = (0.03 + Math.random() * 0.07) * (Math.random() < 0.5 ? -1 : 1)

    if (initial) {
      // Jittered grid so the reveal windows start spread across the frame.
      const rows = Math.max(1, Math.ceil(total / columns))
      const col = index % columns
      const row = Math.floor(index / columns) % rows
      p.x = ((col + 0.5 + (Math.random() - 0.5) * 0.7) / columns) * vw
      p.y = ((row + 0.5 + (Math.random() - 0.5) * 0.7) / rows) * vh
    } else {
      p.x = Math.random() * vw
      p.y = vh + p.radius
    }

    // Heading spans the upward half-plane; the few degrees of margin keep every
    // window climbing instead of sliding sideways along the top.
    const heading = Math.PI * (0.03 + 0.94 * Math.random())
    const speed = 8 + Math.random() * 22
    p.vx = Math.cos(heading) * speed
    p.vy = -Math.sin(heading) * speed

    p.alpha = 0.85 + Math.random() * 0.15
    p.phase = Math.random() * Math.PI * 2
    p.sway = p.radius * 0.06
    p.swayRate = 0.1 + Math.random() * 0.3

    const shape = getSprites()[(Math.random() * SHAPES.length) | 0]
    p.kind = shape.kind
    p.sprite = shape.sprite
    p.ghost = shape.ghost
    p.rotation = Math.random() * Math.PI * 2
    p.spin = (0.08 + Math.random() * 0.34) * (Math.random() < 0.5 ? -1 : 1)
    // The depth copy is bigger and turned a little further, so its corners
    // cross the window's outline instead of hiding underneath it.
    p.ghostScale = 1.25 + Math.random() * 0.3
    p.ghostTurn = (Math.random() - 0.5) * 0.9
    p.ghostOffset = p.radius * (0.35 + Math.random() * 0.3) * (Math.random() < 0.5 ? -1 : 1)
    return p
  }

  function populate() {
    // A few well-separated windows only, so the pattern shows in small islands
    // and the plain background holds most of the frame.
    const target = Math.round(Math.min(8, Math.max(2, (vw * vh) / 250000)))
    columns = Math.max(1, Math.ceil(Math.sqrt(target * (vw / vh))))
    particles.length = 0
    for (let i = 0; i < target; i += 1) {
      particles.push(seedParticle({} as Particle, true, i, target))
    }
  }

  function resize(next: SceneSize) {
    width = next.width
    height = next.height
    vw = next.viewportWidth
    vh = next.viewportHeight
    pattern = makePattern()
    populate()
  }

  function stamp(p: Particle, size = 1, alpha = p.alpha, offset = 0, sprite = p.sprite, turn = 0) {
    const r = p.radius * size
    ctx.save()
    ctx.globalAlpha = alpha
    // Window coords are viewport-relative; shift by the bleed so the pattern
    // extends under the wrap's hidden margin.
    ctx.translate(p.x + BLEED, p.y + BLEED)
    ctx.rotate(p.rotation + turn)
    if (offset) ctx.translate(0, offset)
    ctx.drawImage(sprite as CanvasImageSource, -r, -r, r * 2, r * 2)
    ctx.restore()
  }

  function draw(t: number) {
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    // No clearRect: the source-in fillRect below covers the whole canvas and
    // discards everything outside the windows, so clearing first would be a
    // second full-canvas pass for nothing.

    // 1. Paint the reveal windows. Overlaps accumulate, so two windows meeting
    //    brighten towards full pattern rather than cancelling out. Each window
    //    carries a half-opacity offset copy for depth, exactly as in the
    //    original repo.
    for (const p of particles) {
      stamp(p, p.ghostScale, p.alpha * 0.5, p.ghostOffset, p.ghost, p.ghostTurn)
      stamp(p)
    }
    ctx.globalAlpha = 1

    // 2. Keep the pattern only where those windows are, at their alpha.
    const drift = ((t % DRIFT_SECONDS) / DRIFT_SECONDS) * TILE
    ctx.globalCompositeOperation = 'source-in'
    ctx.translate(drift, drift)
    ctx.fillStyle = pattern!
    ctx.fillRect(-TILE, -TILE, width + TILE * 2, height + TILE * 2)
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
  }

  function advance(nowMs: number, dt: number) {
    const t = nowMs / 1000
    for (const p of particles) {
      p.x += (p.vx + Math.cos(t * p.swayRate + p.phase) * p.sway) * dt
      p.y += p.vy * dt
      p.radius *= 1 + p.growth * dt
      p.radius = Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, p.radius))
      p.rotation += p.spin * dt

      // Recycle only when the window has left the VIEWPORT (same bounds as the
      // original demo — the hidden bleed margin never retires a window, and
      // respawns enter view after radius px, not radius + 160).
      if (p.y + p.radius < 0 || p.x < -p.radius * 2 || p.x > vw + p.radius * 2) {
        seedParticle(p, false, 0, 1)
      }
    }
    return t
  }

  resize(options)

  let last = 0

  return {
    resize,
    frame(nowMs: number) {
      const dt = last ? Math.min((nowMs - last) / 1000, 0.05) : 1 / 30
      last = nowMs
      advance(nowMs, dt)
      draw(nowMs / 1000)
    },
    drawStill() {
      draw(0)
    },
  }
}
