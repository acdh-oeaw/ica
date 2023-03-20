import Link from "next/link";

import { useI18n } from "@/lib/i18n/use-i18n";

export const mainContentId = "main-content";

export function SkipNav(): JSX.Element {
	const { t } = useI18n<"common">();

	function onMoveFocus() {
		const element = document.getElementById(mainContentId);
		element?.focus();
	}

	return (
		<Link
			className="absolute -translate-y-32 focus:translate-y-0"
			href={{ hash: mainContentId }}
			onClick={onMoveFocus}
		>
			{t(["common", "page", "skip-to-main-content"])}
		</Link>
	);
}
