'use client'

import { useState } from 'react'

interface CodeViewerProps {
  title: string
  description?: string
  fileName: string
  code: string
  onBack: () => void
  onDelete?: () => void
  deleting?: boolean
}

export function CodeViewer({
  title,
  description,
  fileName,
  code,
  onBack,
  onDelete,
  deleting = false,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity"
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
          Back to Gallery
        </button>

        <div className="flex items-center gap-3">
          {onDelete && !showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-30 hover:opacity-100 hover:text-red-500 transition-all duration-300"
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
          )}
          {onDelete && showConfirm && (
            <>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Delete this creation?
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
            </>
          )}
          <button
            onClick={copyCode}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] border border-[var(--border-color)] px-4 py-2 rounded-full hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all"
          >
            {copied ? (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-archivo text-3xl font-light italic">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] font-light">
            {description}
          </p>
        )}
      </div>

      <div className="rounded-[30px] border border-[var(--border-color)] overflow-hidden bg-white/5">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-white/5">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">
            {fileName}
          </span>
        </div>

        <div className="p-8 overflow-auto max-h-[500px] code-block font-mono text-sm leading-relaxed">
          <pre className="text-[var(--text-primary)] opacity-80">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
