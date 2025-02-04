// eslint-disable-next-line no-restricted-imports
import type { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";
import logo from "@/public/assets/images/logo.svg";

export function AppFooter(): ReactNode {
	const t = useTranslations("AppFooter");

	const acdh = {
		label: "ACDH-CH",
		href: "https://www.oeaw.ac.at/acdh",
	};

	const imprint = {
		label: t("links.imprint"),
		href: createHref({ pathname: `/imprint` }),
	};

	return (
		<footer className="border-t border-neutral-200">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-4 text-xs font-medium">
				<span className="flex items-center gap-2">
					<a href={acdh.href} rel="noreferrer" target="_blank">
						<Image alt="" className="size-8" src={logo as StaticImageData} />
					</a>
					&copy; {new Date().getUTCFullYear()}{" "}
					<a href={acdh.href} rel="noreferrer" target="_blank">
						{acdh.label}
					</a>
				</span>
				<Link href={imprint.href}>{imprint.label}</Link>
			</div>
		</footer>
	);
}
