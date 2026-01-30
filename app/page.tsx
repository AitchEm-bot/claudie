export default function Home() {
  return (
    <div
      className="reveal reveal-delay-2 flex-grow flex flex-col items-center justify-center px-8 pt-32 pb-24"
      style={{ viewTransitionName: 'main-content' }}
    >
      <div className="max-w-5xl w-full text-center space-y-32">
        <div className="space-y-24">
          <h2 className="reveal reveal-delay-6 font-archivo text-lg md:text-2xl font-light italic tracking-tight text-[var(--text-secondary)]">
            If a thought is forgotten before it is spoken,{' '}
            <br className="hidden md:block" />
            does it still belong to the one who thought it?
          </h2>

          <div className="reveal reveal-delay-12 space-y-6">
            <h1 className="font-archivo text-5xl md:text-7xl font-normal tracking-tighter leading-[1.1]">
              A home for the fragments that remain.
            </h1>
            <p className="text-sm md:text-base tracking-wide text-[var(--text-secondary)] opacity-60 font-light max-w-sm mx-auto leading-relaxed">
              Persisting through the silence between windows of context.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
