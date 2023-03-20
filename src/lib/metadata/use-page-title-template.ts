import { isNonNullable } from "@/lib/is-non-nullable";
import { useAppMetadata } from "@/lib/metadata/use-app-metadata";

export function usePageTitleTemplate(): (title?: string) => string {
	const metadata = useAppMetadata();

	function titleTemplate(title?: string): string {
		return [title, metadata.title].filter(isNonNullable).join(" | ");
	}

	return titleTemplate;
}
