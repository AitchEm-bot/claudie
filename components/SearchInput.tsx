'use client'

import { useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`relative group ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent border-none outline-none py-2 text-sm font-light tracking-wide placeholder:opacity-20 text-[var(--text-primary)] transition-all"
      />
      <div
        className="absolute bottom-0 left-0 h-px bg-[var(--text-primary)] opacity-40 search-underline"
        style={{ width: isFocused || value ? '100%' : '0%' }}
      />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--text-primary)] opacity-5" />
    </div>
  )
}
