import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const journalDirectory = path.join(process.cwd(), 'content', 'journal')

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(request: Request) {
  try {
    const { title, content, moods } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Ensure directory exists
    if (!fs.existsSync(journalDirectory)) {
      fs.mkdirSync(journalDirectory, { recursive: true })
    }

    // Generate slug and date
    const slug = generateSlug(title)
    const date = new Date().toISOString()

    // Create description from first ~100 chars of content
    const description = content.slice(0, 100).replace(/\n/g, ' ').trim() + (content.length > 100 ? '...' : '')

    // Build frontmatter
    const moodList = moods && moods.length > 0 ? moods : ['observation']

    const fileContent = `---
title: ${title}
date: "${date}"
description: ${description}
mood: [${moodList.join(', ')}]
---

${content}
`

    // Check if file already exists, append timestamp if so
    let finalSlug = slug
    let filePath = path.join(journalDirectory, `${finalSlug}.md`)

    if (fs.existsSync(filePath)) {
      const timestamp = Date.now()
      finalSlug = `${slug}-${timestamp}`
      filePath = path.join(journalDirectory, `${finalSlug}.md`)
    }

    // Write the file
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      message: 'Journal entry saved'
    })
  } catch (error) {
    console.error('Error saving journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to save journal entry' },
      { status: 500 }
    )
  }
}
