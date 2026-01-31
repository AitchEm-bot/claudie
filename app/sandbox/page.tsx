import { getAllContent, getRawContent } from '@/lib/markdown'
import { SandboxClient, SandboxCreation } from '@/components/SandboxClient'

export default function SandboxPage() {
  const contentMeta = getAllContent('sandbox')

  const creations: SandboxCreation[] = contentMeta.map((meta) => {
    const rawCode = getRawContent('sandbox', meta.slug) || ''

    return {
      slug: meta.slug,
      title: meta.title,
      date: meta.date,
      description: meta.description,
      language: meta.language,
      category: meta.category,
      fileName: meta.fileName,
      codePreview: meta.codePreview,
      code: rawCode.trim(),
    }
  })

  const languages = [...new Set(creations.map((c) => c.language).filter(Boolean))] as string[]
  const categories = [...new Set(creations.map((c) => c.category).filter(Boolean))] as string[]

  return <SandboxClient creations={creations} languages={languages} categories={categories} />
}
