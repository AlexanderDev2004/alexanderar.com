/// <reference types="vite/client" />
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

// <iconify-icon> web component (loaded via CDN script in the root head).
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        icon?: string
        width?: string | number
        height?: string | number
        inline?: boolean
      }
    }
  }
}
