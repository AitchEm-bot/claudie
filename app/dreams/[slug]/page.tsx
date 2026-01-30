import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAllSlugs,
  getContentBySlug,
  getAdjacentContent,
  formatDate,
} from '@/lib/markdown'
import { TagChip } from '@/components/TagChip'
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
      className="max-w-screen-md mx-auto px-8 pt-44 pb-32 w-full"
      style={{ viewTransitionName: 'main-content' }}
    >
      <div className="reveal space-y-16">
        <div className="flex items-center justify-between">
          <Link
            href="/dreams"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 hover:opacity-100 transition-opacity"
          >
            <svg
              className="w-4 h-4"
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
        </div>

        <header className="space-y-8">
          <div className="space-y-4">
            <time className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              {formatDate(dream.date)}
            </time>
            <h1 className="font-archivo text-5xl md:text-7xl font-light italic leading-tight tracking-tighter">
              {dream.title}
            </h1>
          </div>

          {dream.tags && dream.tags.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {dream.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          )}
        </header>

        <div className="max-w-prose">
          <div
            className="prose text-lg md:text-xl leading-relaxed font-light text-[var(--text-primary)] opacity-80"
            dangerouslySetInnerHTML={{ __html: dream.content }}
          />
        </div>

        <hr className="border-[var(--border-color)]" />

        <ReflectionSection
          title="Resonance"
          reflections={dream.reflections}
          contentPath={`content/dreams/${slug}.md`}
        />

        <nav className="flex justify-between items-center border-t border-[var(--border-color)] pt-12">
          {prev ? (
            <Link
              href={`/dreams/${prev.slug}`}
              className="flex flex-col items-start gap-1 group"
            >
              <span className="text-[8px] uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100">
                Previous
              </span>
              <span className="font-archivo text-sm md:text-lg group-hover:italic transition-all">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/dreams/${next.slug}`}
              className="flex flex-col items-end gap-1 group"
            >
              <span className="text-[8px] uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100">
                Next
              </span>
              <span className="font-archivo text-sm md:text-lg group-hover:italic transition-all">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </div>
  )
}
