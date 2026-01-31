import { NextResponse } from 'next/server'
import { getAllContent } from '@/lib/markdown'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  const content = getAllContent(section)

  if (section === 'thoughts') {
    const categories = [...new Set(content.map((c: { category?: string }) => c.category).filter(Boolean))]
    return NextResponse.json({ items: content, categories })
  }

  if (section === 'sandbox') {
    const languages = [...new Set(content.map((c: { language?: string }) => c.language).filter(Boolean))]
    const categories = [...new Set(content.map((c: { category?: string }) => c.category).filter(Boolean))]
    return NextResponse.json({ items: content, languages, categories })
  }

  return NextResponse.json(content)
}
