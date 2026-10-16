import { useEffect, useState } from 'react'
import bodies from '../data/icons.json'

const registry = bodies as Record<string, string>

const COPY_SVG =
  '<svg class="icon" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  (registry['mdi:content-copy'] ?? '') +
  '</svg>'
const CHECK_SVG =
  '<svg class="icon" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  (registry['mdi:check'] ?? '') +
  '</svg>'

/**
 * Copy-to-clipboard button for code blocks inside `.md-body`.
 *
 * Blog bodies are server-rendered from markdown into raw HTML, so this
 * component is mounted once on the page and enhances every matching `pre`
 * with a floating button after hydration (scanning the whole document —
 * the markdown HTML itself is not a React child). The button is added
 * client-side only, so no-JS rendering is unchanged.
 */
export function CodeCopyEnhancer({ selector = '.md-body pre' }: { selector?: string }) {
  const [copied, setCopied] = useState(false)

  // Mount buttons once; they outlive React state changes below.
  useEffect(() => {
    const timers: number[] = []
    const cleanups: Array<() => void> = []

    document.querySelectorAll<HTMLElement>(selector).forEach((block) => {
      if (block.querySelector('.code-copy')) return

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'code-copy'
      btn.setAttribute('aria-label', 'Copy code to clipboard')
      btn.innerHTML = COPY_SVG

      const onClick = async () => {
        const text = block.querySelector('code')?.textContent ?? block.textContent ?? ''
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          // clipboard API can be unavailable (http, permissions) — best effort
          return
        }
        btn.innerHTML = CHECK_SVG
        btn.classList.add('copied')
        btn.setAttribute('aria-label', 'Copied')
        timers.push(
          window.setTimeout(() => {
            btn.innerHTML = COPY_SVG
            btn.classList.remove('copied')
            btn.setAttribute('aria-label', 'Copy code to clipboard')
          }, 1600),
        )
      }

      btn.addEventListener('click', onClick)
      block.appendChild(btn)
      cleanups.push(() => {
        btn.removeEventListener('click', onClick)
        btn.remove()
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [selector])

  return null
}
