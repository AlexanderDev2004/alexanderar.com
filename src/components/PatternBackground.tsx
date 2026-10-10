import { useEffect, useRef } from 'react'

/**
 * "Hideout" (Hero Patterns) background, revealed only inside a field of
 * random-size blurred circles used as a CSS mask, drifting left→right
 * incredibly slowly. Motion is disabled for prefers-reduced-motion users.
 */

// Deterministic PRNG so the server render and the client hydration produce
// the exact same circle field (avoids a hydration mismatch).
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A lot of random-size soft circles: each mask layer is a radial gradient
// (solid center, fading edge = the "blur"). Alpha 0 = pattern hidden.
function buildCircleMask(): string {
  const rand = mulberry32(20261010)
  const layers: string[] = []
  for (let i = 0; i < 16; i++) {
    const size = Math.round(240 + rand() * 420) // 240–660px
    const x = (rand() * 108 - 4).toFixed(1) // -4% … 104%
    const y = (rand() * 108 - 4).toFixed(1)
    layers.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, ` +
        `rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 70%)`,
    )
  }
  return layers.join(', ')
}

const CIRCLE_MASK = buildCircleMask()

// Hideout pattern, recolored slightly darker than the beige background.
// (Source: https://heropatterns.com — "Hideout", 40x40 tile, MIT.)
const HIDEOUT_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath fill='%23e2dac9' d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/svg%3E\")"

export function PatternBackground() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 36
      const y = (e.clientY / window.innerHeight - 0.5) * 36
      wrap.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      ref={wrapRef}
      className="bg-pattern-wrap"
      aria-hidden="true"
      style={{
        WebkitMaskImage: CIRCLE_MASK,
        maskImage: CIRCLE_MASK,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    >
      <div className="bg-pattern" />
    </div>
  )
}
