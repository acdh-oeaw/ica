import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";

export function AppFooter(): ReactNode {
	const t = useTranslations("AppFooter");

	const acdh = {
		label: "Austrian Centre for Digital Humanities",
		href: "https://www.oeaw.ac.at/acdh",
	};

	const imprint = {
		label: t("links.imprint"),
		href: createHref({ pathname: "/imprint" }),
	};

	return (
		<footer className="border-t border-neutral-200">
			<div className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-x-6 gap-y-3 px-5 py-6 text-[0.8125rem] leading-relaxed font-normal text-neutral-600 sm:px-8">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span className="shrink-0">&copy; {new Date().getUTCFullYear()}</span>
					<a
						className="underline decoration-neutral-400 decoration-dotted underline-offset-4 hover:text-neutral-900 hover:decoration-neutral-600 focus-visible:text-neutral-900"
						href={acdh.href}
						rel="noreferrer"
						target="_blank"
					>
						{acdh.label}
					</a>
				</div>
				<Link
					className="py-1 hover:text-neutral-900 hover:underline focus-visible:text-neutral-900"
					href={imprint.href}
				>
					{imprint.label}
				</Link>
			</div>
		</footer>
	);
}
