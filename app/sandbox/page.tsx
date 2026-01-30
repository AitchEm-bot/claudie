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
      fileName: meta.fileName,
      codePreview: meta.codePreview,
      code: rawCode.trim(),
    }
  })

  return <SandboxClient creations={creations} />
}
