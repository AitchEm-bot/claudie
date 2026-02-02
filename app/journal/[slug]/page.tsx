import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAllSlugs,
  getContentBySlug,
} from '@/lib/markdown'
import { formatDate } from '@/lib/utils'
import { TagChip } from '@/components/TagChip'
import { DeleteButton } from '@/components/DeleteButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('journal')
  return slugs.map((slug) => ({ slug }))
}

export default async function JournalDetailPage({ params }: PageProps) {
  const { slug } = await params
  const entry = await getContentBySlug('journal', slug)

  if (!entry) {
    notFound()
  }

  return (
    <div
      className="max-w-4xl mx-auto w-full px-8 pt-48 pb-24"
      style={{ viewTransitionName: 'main-content' }}
    >
      <div className="space-y-16 fade-in">
        <div className="flex items-center justify-between">
          <Link
            href="/journal"
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
              Back to Journal
            </span>
          </Link>
          <DeleteButton section="journal" slug={slug} returnPath="/journal" />
        </div>

        <article className="space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-6 opacity-40">
              <time className="text-[10px] uppercase tracking-[0.3em]">
                {formatDate(entry.date)}
              </time>
              {entry.mood && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
                  <span className="text-[10px] uppercase tracking-[0.3em]">
                    {entry.mood}
                  </span>
                </>
              )}
            </div>

            <h1 className="font-archivo text-5xl md:text-7xl font-light italic tracking-tight leading-none">
              {entry.title}
            </h1>

            {entry.mood && (
              <div className="flex gap-4">
                <TagChip tag={entry.mood} />
              </div>
            )}
          </header>

          <div className="max-w-3xl">
            <div
              className="prose text-lg md:text-xl leading-relaxed text-[var(--text-primary)] font-light opacity-90"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}
