import { useAppMetadata } from '@/app/metadata/use-app-metadata'
import { isNonNullable } from '@/lib/is-non-nullable'

export function usePageTitleTemplate(): (title?: string) => string {
  const metadata = useAppMetadata()

  function titleTemplate(title?: string): string {
    return [title, metadata.title].filter(isNonNullable).join(' | ')
  }

  return titleTemplate
}
