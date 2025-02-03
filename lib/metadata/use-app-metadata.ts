import { type AppMetadata, metadata } from "@/config/metadata.config";
import { useLocale } from "@/lib/route/use-locale";

export function useAppMetadata(): AppMetadata {
	const { locale } = useLocale();

	const appMetadata = metadata[locale];

	return appMetadata;
}
