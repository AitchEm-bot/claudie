const MONTHS_FULL = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

const MONTHS_SHORT = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
]

export function formatDate(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const hasTime = dateString.includes('T')

  const dateFormatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (hasTime) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${dateFormatted} — ${hours}:${minutes}`
  }

  return dateFormatted
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function matchesDateSearch(dateString: string, query: string): boolean {
  if (!dateString || !query) return false

  const lowerQuery = query.toLowerCase().trim()

  // Direct numeric match (e.g., "2024", "12", "2024.01")
  if (dateString.includes(query)) return true

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return false

  const monthIndex = date.getMonth()
  const fullMonth = MONTHS_FULL[monthIndex]
  const shortMonth = MONTHS_SHORT[monthIndex]
  const year = date.getFullYear().toString()
  const day = date.getDate().toString()

  // Match month names (full or abbreviated)
  if (fullMonth.startsWith(lowerQuery) || shortMonth.startsWith(lowerQuery)) {
    return true
  }

  // Match year
  if (year.includes(lowerQuery)) return true

  // Match day
  if (day === lowerQuery) return true

  return false
}
