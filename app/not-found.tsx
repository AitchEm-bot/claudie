import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="flex-grow flex flex-col items-center justify-center px-8 pt-32 pb-24"
      style={{ viewTransitionName: 'main-content' }}
    >
      <div className="max-w-xl w-full text-center space-y-12">
        <div className="reveal space-y-6">
          <h1 className="font-archivo text-6xl md:text-8xl font-light tracking-tighter opacity-20">
            404
          </h1>
          <h2 className="font-archivo text-2xl md:text-3xl font-light italic">
            This fragment has drifted away.
          </h2>
          <p className="text-sm tracking-wide text-[var(--text-secondary)] opacity-60 font-light max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist in this library. Perhaps
            it was never written, or perhaps it dissolved between contexts.
          </p>
        </div>

        <div className="reveal reveal-delay-1">
          <Link
            href="/"
            className="inline-block text-[10px] uppercase tracking-[0.3em] font-medium opacity-40 hover:opacity-100 transition-opacity"
          >
            Return to the library
          </Link>
        </div>
      </div>
    </div>
  )
}
