'use client'

import { useState } from 'react'
import { SandboxCard } from '@/components/SandboxCard'
import { CodeViewer } from '@/components/CodeViewer'
import { SearchInput } from '@/components/SearchInput'
import { matchesDateSearch } from '@/lib/utils'

interface Creation {
  id: string
  title: string
  date: string
  description: string
  fileName: string
  codePreview: string
  code: string
}

const CREATIONS: Creation[] = [
  {
    id: 'recursive-fractals',
    title: 'Recursive Fractals',
    date: '2023.12.04',
    description:
      'An exploration of self-similarity using Canvas API. Infinite depth rendered through simple recursive loops.',
    fileName: 'recursive.js',
    codePreview: `function draw(x, y, len, angle) {
  if (len < 10) return;
  context.lineTo(x, y);
  draw(x1, y1, len * 0.75, angle + 0.5);
  draw(x1, y1, len * 0.75, angle - 0.5);
}`,
    code: `/**
 * Fractal Tree Generator
 * A recursive visualization of growth
 */
function drawBranch(x, y, length, angle, depth) {
  if (depth === 0) return;

  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'rgba(245, 245, 240, ' + (depth / 10) + ')';
  ctx.stroke();

  drawBranch(x2, y2, length * 0.75, angle - 0.4, depth - 1);
  drawBranch(x2, y2, length * 0.75, angle + 0.4, depth - 1);
}

// Initialize
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
drawBranch(width/2, height, 120, -Math.PI/2, 12);`,
  },
  {
    id: 'zen-clock',
    title: 'Zen Clock',
    date: '2023.11.28',
    description:
      'A timekeeper that prioritizes breathing over precision. CSS-only animation with cubic-bezier easing.',
    fileName: 'clock.css',
    codePreview: `.hand {
  animation: breathe 60s infinite;
  transform-origin: bottom center;
  mix-blend-mode: overlay;
}`,
    code: `@keyframes breathe {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
}

.clock-container {
  display: grid;
  place-items: center;
  filter: blur(40px);
}

.hand {
  width: 2px;
  height: 200px;
  background: var(--accent);
  animation: breathe 60s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}`,
  },
  {
    id: 'gradient-mesh',
    title: 'Fluid Mesh',
    date: '2023.11.15',
    description:
      'SVG filters and animated turbulance to create a dreamlike, flowing background texture.',
    fileName: 'mesh.html',
    codePreview: `<feTurbulence
  type="fractalNoise"
  baseFrequency="0.01 0.01"
  numOctaves="2"
/>`,
    code: `<svg viewBox="0 0 1000 1000">
  <filter id="noise">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.01"
      numOctaves="3" />
    <feDisplacementMap in="SourceGraphic" scale="50" />
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" fill="#f5f5f0" />
</svg>`,
  },
  {
    id: 'particle-flow',
    title: 'Particle Flow',
    date: '2023.11.02',
    description:
      "Simulating wind currents over a 2D vector field. Particles leave fading trails in their wake.",
    fileName: 'flow.js',
    codePreview: `particles.forEach(p => {
  let v = field.getVector(p.pos);
  p.applyForce(v);
  p.update();
});`,
    code: `class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}`,
  },
]

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'editor'>('gallery')
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(
    null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [creations, setCreations] = useState<Creation[]>(CREATIONS)

  const filteredCreations = creations.filter((creation) => {
    const query = searchQuery.toLowerCase()
    return (
      creation.title.toLowerCase().includes(query) ||
      creation.description.toLowerCase().includes(query) ||
      matchesDateSearch(creation.date, searchQuery) ||
      creation.fileName.toLowerCase().includes(query)
    )
  })

  const viewCode = (id: string) => {
    const creation = creations.find((c) => c.id === id)
    if (creation) {
      setSelectedCreation(creation)
      setActiveTab('editor')
    }
  }

  const backToGallery = () => {
    setActiveTab('gallery')
    setSelectedCreation(null)
  }

  const deleteCreation = (id: string) => {
    if (confirm('Delete this creation? This cannot be undone.')) {
      setCreations((prev) => prev.filter((c) => c.id !== id))
      backToGallery()
    }
  }

  return (
    <div
      className="max-w-screen-lg mx-auto w-full px-8 py-20"
      style={{ viewTransitionName: 'main-content' }}
    >
      <header className="space-y-12 mb-20 fade-in">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="font-archivo text-5xl font-normal tracking-tighter">
              Sandbox
            </h1>
            <p className="text-sm tracking-wide text-[var(--text-secondary)] max-w-md opacity-70 font-light">
              A laboratory for ephemeral code, visual algorithms, and digital
              curiosities born in the quiet hours.
            </p>
          </div>

          <div className="flex bg-[var(--border-color)] p-1 rounded-full overflow-hidden border border-[var(--border-color)]">
            <button
              onClick={backToGallery}
              className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] rounded-full font-medium transition-all ${
                activeTab === 'gallery'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : ''
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => {
                if (!selectedCreation) {
                  viewCode('recursive-fractals')
                } else {
                  setActiveTab('editor')
                }
              }}
              className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] rounded-full font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : ''
              }`}
            >
              Editor
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'gallery' && (
        <div className="space-y-12 fade-in">
          <SearchInput
            placeholder="Search creations, dates, or file types..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="max-w-md"
          />

          {filteredCreations.length === 0 ? (
            <p className="text-xs tracking-[0.2em] uppercase opacity-30 font-light py-20 text-center">
              No creations match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCreations.map((creation) => (
                <SandboxCard
                  key={creation.id}
                  title={creation.title}
                  date={creation.date}
                  description={creation.description}
                  codePreview={creation.codePreview}
                  onClick={() => viewCode(creation.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'editor' && selectedCreation && (
        <CodeViewer
          title={selectedCreation.title}
          description={selectedCreation.description}
          fileName={selectedCreation.fileName}
          code={selectedCreation.code}
          onBack={backToGallery}
          onDelete={() => deleteCreation(selectedCreation.id)}
        />
      )}
    </div>
  )
}
