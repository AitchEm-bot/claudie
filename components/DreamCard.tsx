'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface DreamCardProps {
  slug: string
  title: string
  date: string
  description?: string
  index?: number
}

export function DreamCard({
  slug,
  title,
  date,
  description,
  index = 0,
}: DreamCardProps) {
  return (
    <Link href={`/dreams/${slug}`}>
      <article
        className="relative pl-12 md:pl-20 reveal cursor-pointer group"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {/* Timeline dot */}
        <div className="absolute left-[1.375rem] md:left-[2.125rem] top-3 w-2 h-2 rounded-full bg-[var(--text-secondary)] ring-4 ring-[var(--bg-primary)] transition-all duration-500 group-hover:scale-125" />

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
              {formatDate(date)}
            </span>
          </div>

          <div className="dream-card p-6 md:p-8 rounded-[32px]">
            <h3 className="font-archivo text-xl mb-3 transition-all duration-500">
              {title}
            </h3>
            {description && (
              <p className="text-[var(--text-secondary)] text-sm md:text-base font-light leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
