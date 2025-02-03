import { useLocale } from "@/lib/route/use-locale";
import { type AppMetadata, metadata } from "~/config/metadata.config";

export function useAppMetadata(): AppMetadata {
	const { locale } = useLocale();

	const appMetadata = metadata[locale];

	return appMetadata;
}
