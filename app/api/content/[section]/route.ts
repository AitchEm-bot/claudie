import { NextResponse } from 'next/server'
import { getAllContent } from '@/lib/markdown'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  const content = getAllContent(section)
  return NextResponse.json(content)
}
