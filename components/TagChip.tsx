interface TagChipProps {
  tag: string
  className?: string
}

export function TagChip({ tag, className = '' }: TagChipProps) {
  return (
    <span
      className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[var(--border-color)] opacity-40 ${className}`}
    >
      #{tag}
    </span>
  )
}
