'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  section: 'thoughts' | 'dreams' | 'journal'
  slug: string
  returnPath: string
}

export function DeleteButton({ section, slug, returnPath }: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`/api/content/${section}/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push(returnPath)
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete')
        setDeleting(false)
        setShowConfirm(false)
      }
    } catch {
      alert('Failed to delete. Please try again.')
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          Delete this fragment?
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-full border border-red-500/50 text-red-500 text-[10px] uppercase tracking-[0.15em] hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="px-4 py-2 rounded-full border border-[var(--border-color)] text-[10px] uppercase tracking-[0.15em] hover:border-[var(--text-secondary)] transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium opacity-30 hover:opacity-100 hover:text-red-500 transition-all duration-300"
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Delete
    </button>
  )
}
