import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export async function POST(
  request: Request,
  { params }: { params: Promise<{ section: string; slug: string }> }
) {
  try {
    const { section, slug } = await params

    // Validate section
    const allowedSections = ['thoughts', 'dreams', 'journal']
    if (!allowedSections.includes(section)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      )
    }

    const { text, reaction } = await request.json()

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Reflection text is required' },
        { status: 400 }
      )
    }

    const filePath = path.join(contentDirectory, section, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // Create new reflection
    const newReflection: { author: string; date: string; text: string; reaction?: string } = {
      author: 'User',
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
    }

    // Add reaction if provided (single word only)
    if (reaction && typeof reaction === 'string') {
      const cleanReaction = reaction.trim().split(/\s+/)[0]
      if (cleanReaction) {
        newReflection.reaction = cleanReaction
      }
    }

    // Add to reflections array
    if (!data.reflections) {
      data.reflections = []
    }
    data.reflections.push(newReflection)

    // Rebuild the file
    const newFileContents = matter.stringify(content, data)
    fs.writeFileSync(filePath, newFileContents)

    return NextResponse.json({
      success: true,
      reflection: newReflection,
    })
  } catch (error) {
    console.error('Error adding reflection:', error)
    return NextResponse.json(
      { error: 'Failed to add reflection' },
      { status: 500 }
    )
  }
}
