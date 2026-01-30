'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Reflection {
  author: string
  date: string
  text: string
  reaction?: string
}

interface ReflectionSectionProps {
  title: string
  reflections?: Reflection[]
  section: string
  slug: string
}

export function ReflectionSection({
  title,
  reflections = [],
  section,
  slug,
}: ReflectionSectionProps) {
  const [newReflection, setNewReflection] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!newReflection.trim() || submitting) return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/content/${section}/${slug}/reflection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newReflection }),
      })

      if (response.ok) {
        setNewReflection('')
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add reflection')
      }
    } catch {
      alert('Failed to add reflection. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="pt-24 space-y-12 border-t border-[var(--border-color)]">
      <div className="flex items-center justify-between">
        <h3 className="font-archivo text-xs uppercase tracking-[0.4em] opacity-40">
          {title}
        </h3>
        <span className="text-[10px] opacity-30 uppercase">
          {reflections.length} {reflections.length === 1 ? 'ECHO' : 'ECHOES'}
        </span>
      </div>

      <div className="space-y-8">
        {reflections.length === 0 ? (
          <p className="text-xs italic opacity-30">No traces left yet.</p>
        ) : (
          reflections.map((reflection, index) => (
            <div
              key={index}
              className="border-l border-[var(--border-color)] pl-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--border-color)] flex items-center justify-center text-[8px] font-bold opacity-60">
                    {reflection.author[0].toUpperCase()}
                  </div>
                  <span className="text-[10px] font-medium tracking-wider">
                    {reflection.author}
                  </span>
                  <span className="text-[9px] opacity-20 tracking-tighter">
                    {reflection.date}
                  </span>
                </div>
                {reflection.reaction && (
                  <button className="px-2 py-1 rounded-full border border-[var(--border-color)] text-[10px] opacity-40 hover:opacity-100 transition-all">
                    {reflection.reaction}
                  </button>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {reflection.text}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="pt-8">
        <div className="relative group">
          <textarea
            placeholder="Add a reflection..."
            rows={1}
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
            disabled={submitting}
            className="w-full bg-transparent border-b border-[var(--border-color)] focus:border-[var(--text-primary)] outline-none py-4 text-sm font-light tracking-wide placeholder:opacity-20 transition-all resize-none overflow-hidden disabled:opacity-50"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = ''
              target.style.height = target.scrollHeight + 'px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="absolute right-0 bottom-4 opacity-20 hover:opacity-100 transition-opacity disabled:opacity-10"
          >
            {submitting ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
