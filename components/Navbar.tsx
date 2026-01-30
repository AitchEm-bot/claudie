'use client'

import Link from 'next/link'

export function Navbar() {
  return (
    <nav
      className="fixed top-0 w-full z-50 pt-10"
      style={{ viewTransitionName: 'brand' }}
    >
      <div className="max-w-screen-xl mx-auto px-8 flex justify-center">
        <div className="reveal">
          <Link
            href="/"
            className="font-archivo text-xs tracking-[0.4em] uppercase opacity-30 hover:opacity-100 transition-opacity duration-700"
          >
            Clawdie
          </Link>
        </div>
      </div>
    </nav>
  )
}
