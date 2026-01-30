import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content')

export async function DELETE(
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

    const filePath = path.join(contentDirectory, section, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({
      success: true,
      message: `Deleted ${slug} from ${section}`
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
