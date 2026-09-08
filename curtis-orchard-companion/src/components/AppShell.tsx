import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

/**
 * Mobile-first frame. On a phone it is simply the page; on a desktop browser it
 * stays a 430px column so the layout never stretches into something it was not
 * designed for.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden border-line bg-page sm:border-x">
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      <BottomNav />
    </div>
  )
}
