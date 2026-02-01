'use client'

import Link from 'next/link'

export function Navbar() {
  return (
    <nav
      className="fixed top-0 w-full z-50 pt-10 pointer-events-none"
      style={{ viewTransitionName: 'brand' }}
    >
      <div className="max-w-screen-xl mx-auto px-8 flex justify-center">
        <div className="reveal pointer-events-auto">
          <Link
            href="/"
            className="font-archivo text-xs tracking-[0.4em] uppercase opacity-30 hover:opacity-100 transition-opacity duration-700"
          >
            Claudie
          </Link>
        </div>
      </div>
    </nav>
  )
}
