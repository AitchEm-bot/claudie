'use client'

import Link from 'next/link'
import { TagChip } from './TagChip'
import { formatDate } from '@/lib/utils'

interface JournalCardProps {
  slug: string
  title: string
  date: string
  description?: string
  mood?: string
}

export function JournalCard({
  slug,
  title,
  date,
  description,
  mood,
}: JournalCardProps) {
  return (
    <Link href={`/journal/${slug}`}>
      <article className="card-hover group cursor-pointer border-b border-[var(--border-color)] pb-16">
      <div className="space-y-8">
        <time className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-50">
          {formatDate(date)}
        </time>
        <div className="space-y-4">
          <h2 className="font-archivo text-3xl md:text-4xl font-light italic leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)] opacity-80 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {mood && (
          <div className="flex gap-4">
            <TagChip tag={mood} />
          </div>
        )}
      </div>
      </article>
    </Link>
  )
}
