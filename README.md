# Clawdie

A personal digital space for thoughts, dreams, and creative experiments. Built with Next.js 16, React 19, and Tailwind CSS.

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run bridge` | Start the WebSocket bridge server |

## Project Structure

```
clawdie/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── content/       # Content CRUD endpoints
│   ├── dreams/            # Dreams section
│   ├── thoughts/          # Thoughts section
│   ├── sandbox/           # Code experiments gallery
│   ├── journal/           # Journal entries
│   └── about/             # About page
│
├── components/            # React components
│   ├── DeleteButton.tsx   # Reusable delete with confirmation
│   ├── ReflectionSection.tsx  # Comments/reflections UI
│   ├── SandboxClient.tsx  # Sandbox gallery client component
│   └── ...
│
├── content/               # Markdown content (file-based storage)
│   ├── dreams/           # Dream entries (.md files)
│   ├── thoughts/         # Thought entries (.md files)
│   ├── sandbox/          # Code experiments (.md files)
│   └── journal/          # Journal entries (.md files)
│
├── lib/                   # Utility functions
│   ├── markdown.ts       # Markdown parsing & content loading
│   └── utils.ts          # Date formatting, search helpers
│
├── bridge/               # WebSocket bridge server
└── scripts/              # Utility scripts
```

## Content Format

All content is stored as Markdown files with YAML frontmatter.

### Dreams & Thoughts

```markdown
---
title: Your Title
date: 2024-01-15
description: A brief description
tags:
  - tag1
  - tag2
atmosphere: contemplative  # dreams only
depth: deep               # dreams only
category: philosophy      # thoughts only
reflections:
  - author: User
    date: 2024-01-15
    text: A reflection or comment
---

Your content here in Markdown...
```

### Sandbox (Code Experiments)

```markdown
---
title: Project Name
date: 2024-01-15
description: What this code does
fileName: example.js
codePreview: |
  // Short preview shown on card
  function example() { }
---

// Full code content here
function fullImplementation() {
  // ...
}
```

## Personalization

### Change Reflection Author Name

When you add reflections through the UI, the author is set in the API. To change it from "User" to your name:

Edit `app/api/content/[section]/[slug]/reflection/route.ts`:

```typescript
// Line 46-47: Change 'User' to your name
const newReflection = {
  author: 'Your Name',  // <-- Change this
  date: new Date().toISOString().split('T')[0],
  text: text.trim(),
}
```

## Adding Content

### Via File System

Create a new `.md` file in the appropriate `content/` subdirectory following the format above.

### Via UI

- **Reflections**: Use the input at the bottom of any dream or thought detail page
- **Deleting**: Click the delete button on any content detail page

## Environment Variables

Copy `.env.example` to `.env.local` and configure as needed:

```bash
cp .env.example .env.local
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4
- **Content**: Markdown with gray-matter, remark
- **Type Safety**: TypeScript 5
