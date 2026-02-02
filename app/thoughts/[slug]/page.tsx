import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAllSlugs,
  getContentBySlug,
  getAdjacentContent,
} from '@/lib/markdown'
import { formatDate } from '@/lib/utils'
import { TagChip } from '@/components/TagChip'
import { ReflectionSection } from '@/components/ReflectionSection'
import { DeleteButton } from '@/components/DeleteButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('thoughts')
  return slugs.map((slug) => ({ slug }))
}

export default async function ThoughtDetailPage({ params }: PageProps) {
  const { slug } = await params
  const thought = await getContentBySlug('thoughts', slug)

  if (!thought) {
    notFound()
  }

  const { prev, next } = getAdjacentContent('thoughts', slug)

  return (
    <div
      className="max-w-4xl mx-auto w-full px-8 pt-48 pb-24"
      style={{ viewTransitionName: 'main-content' }}
    >
      <div className="space-y-16 fade-in">
        <div className="flex items-center justify-between">
          <Link
            href="/thoughts"
            className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity"
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
            <span className="text-[10px] uppercase tracking-[0.3em]">
              Back to Library
            </span>
          </Link>
          <DeleteButton section="thoughts" slug={slug} returnPath="/thoughts" />
        </div>

        <article className="space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-6 opacity-40">
              <time className="text-[10px] uppercase tracking-[0.3em]">
                {formatDate(thought.date)}
              </time>
              {thought.category && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
                  <span className="text-[10px] uppercase tracking-[0.3em]">
                    {thought.category}
                  </span>
                </>
              )}
            </div>

            <h1 className="font-archivo text-5xl md:text-7xl font-light italic tracking-tight leading-none">
              {thought.title}
            </h1>

            {thought.tags && thought.tags.length > 0 && (
              <div className="flex gap-4">
                {thought.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            )}
          </header>

          <div className="max-w-3xl">
            <div
              className="prose text-lg md:text-xl leading-relaxed text-[var(--text-primary)] font-light opacity-90"
              dangerouslySetInnerHTML={{ __html: thought.content }}
            />
          </div>
        </article>

        <ReflectionSection
          title="Conversations & Echoes"
          reflections={thought.reflections}
          section="thoughts"
          slug={slug}
        />

        <nav className="flex justify-between pt-16 border-t border-[var(--border-color)]">
          {prev ? (
            <Link
              href={`/thoughts/${prev.slug}`}
              className="group text-left space-y-2 opacity-30 hover:opacity-100 transition-opacity"
            >
              <p className="text-[8px] uppercase tracking-[0.4em]">Earlier</p>
              <p className="font-archivo text-sm italic group-hover:translate-x-1 transition-transform">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/thoughts/${next.slug}`}
              className="group text-right space-y-2 opacity-30 hover:opacity-100 transition-opacity"
            >
              <p className="text-[8px] uppercase tracking-[0.4em]">Later</p>
              <p className="font-archivo text-sm italic group-hover:-translate-x-1 transition-transform">
                {next.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </div>
  )
}
