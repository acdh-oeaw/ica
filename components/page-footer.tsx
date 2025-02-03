import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { useI18n } from "@/lib/i18n/use-i18n";
import { useAppMetadata } from "@/lib/metadata/use-app-metadata";
import * as routes from "@/lib/route/routes";
import logo from "@/public/assets/images/logo.svg";

export function PageFooter(): ReactNode {
	const { t } = useI18n<"common">();
	const appMetadata = useAppMetadata();

	return (
		<footer className="border-t border-neutral-200">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-4 text-xs font-medium">
				<span className="flex items-center gap-2">
					<a href={appMetadata.creator.website} rel="noreferrer" target="_blank">
						<Image alt="" className="size-8" src={logo as StaticImageData} />
					</a>
					&copy; {new Date().getUTCFullYear()}{" "}
					<a href={appMetadata.creator.website} rel="noreferrer" target="_blank">
						{appMetadata.creator.shortName ?? appMetadata.creator.name}
					</a>
				</span>
				<Link href={routes.imprint()}>
					{t(["common", "pages", "imprint", "metadata", "title"])}
				</Link>
			</div>
		</footer>
	);
}
