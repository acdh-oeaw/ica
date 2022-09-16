import { useAppMetadata } from '@/app/metadata/use-app-metadata'

export function usePageTitleTemplate(): (title?: string) => string {
  const metadata = useAppMetadata()

  function titleTemplate(title?: string): string {
    return [title, metadata.title].filter(Boolean).join(' | ')
  }

  return titleTemplate
}
