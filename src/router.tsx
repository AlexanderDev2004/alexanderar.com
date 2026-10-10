import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { PageSkeleton } from './components/Skeleton'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    trailingSlash: 'always',
    // Shown during client-side navigation when a lazy route chunk takes
    // longer than defaultPendingMs (1 s) to arrive — rarely visible thanks
    // to preload-on-intent, but it beats a blank screen on slow networks.
    defaultPendingComponent: PageSkeleton,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
