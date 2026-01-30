import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAllSlugs,
  getContentBySlug,
  getAdjacentContent,
  formatDate,
} from '@/lib/markdown'
import { ReflectionSection } from '@/components/ReflectionSection'
import { DeleteButton } from '@/components/DeleteButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('dreams')
  return slugs.map((slug) => ({ slug }))
}

export default async function DreamDetailPage({ params }: PageProps) {
  const { slug } = await params
  const dream = await getContentBySlug('dreams', slug)

  if (!dream) {
    notFound()
  }

  const { prev, next } = getAdjacentContent('dreams', slug)

  return (
    <div
      className="min-h-screen flex flex-col pt-12"
      style={{ viewTransitionName: 'main-content' }}
    >
      <nav className="w-full max-w-screen-xl mx-auto px-8 flex justify-between items-center mb-24">
        <Link
          href="/dreams"
          className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Archive
        </Link>
        <DeleteButton section="dreams" slug={slug} returnPath="/dreams" />
      </nav>

      <main className="flex-grow max-w-screen-md mx-auto px-8 fade-in">
        <header className="space-y-8 mb-20 text-center">
          <time className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-secondary)] block">
            {formatDate(dream.date)}
          </time>
          <h1 className="font-archivo text-5xl md:text-7xl font-light italic leading-tight tracking-tight">
            {dream.title}
          </h1>

          {(dream.atmosphere || dream.depth) && (
            <div className="flex justify-center gap-6 text-[9px] uppercase tracking-[0.2em] opacity-40">
              {dream.atmosphere && (
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                  </svg>
                  Atmosphere: {dream.atmosphere}
                </span>
              )}
              {dream.depth && (
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Depth: {dream.depth}
                </span>
              )}
            </div>
          )}
        </header>

        <div
          className="dream-content text-lg md:text-xl font-light text-[var(--text-primary)] mb-32"
          dangerouslySetInnerHTML={{ __html: dream.content }}
        />

        <hr className="border-[var(--border-color)]" />

        <ReflectionSection
          title="Resonance"
          reflections={dream.reflections}
          section="dreams"
          slug={slug}
        />

        <nav className="flex flex-col md:flex-row justify-between items-center gap-12 py-20 border-t border-[var(--border-color)]">
          {prev ? (
            <Link
              href={`/dreams/${prev.slug}`}
              className="group flex flex-col items-start gap-3 opacity-40 hover:opacity-100 transition-opacity"
            >
              <span className="text-[9px] uppercase tracking-[0.3em]">Previous Dream</span>
              <span className="font-archivo text-xl italic group-hover:translate-x-2 transition-transform">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/dreams/${next.slug}`}
              className="group flex flex-col items-end text-right gap-3 opacity-40 hover:opacity-100 transition-opacity"
            >
              <span className="text-[9px] uppercase tracking-[0.3em]">Next Dream</span>
              <span className="font-archivo text-xl italic group-hover:-translate-x-2 transition-transform">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </div>
  )
}
