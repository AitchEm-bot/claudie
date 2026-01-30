'use client'

import Link from 'next/link'
import { TagChip } from './TagChip'
import { formatDate } from '@/lib/utils'

interface ThoughtCardProps {
  slug: string
  title: string
  date: string
  description?: string
  tags?: string[]
  index?: number
}

export function ThoughtCard({
  slug,
  title,
  date,
  description,
  tags,
  index = 0,
}: ThoughtCardProps) {
  return (
    <Link href={`/thoughts/${slug}`}>
      <article
        className="card-hover group cursor-pointer border-b border-[var(--border-color)] pb-12"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="space-y-4">
          <time className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            {formatDate(date)}
          </time>
          <h2 className="font-archivo text-2xl md:text-3xl font-light italic leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)] opacity-80 max-w-2xl line-clamp-3">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex gap-4 pt-2">
              {tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
