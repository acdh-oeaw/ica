import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";

export function AppHeader(): ReactNode {
	const t = useTranslations("AppHeader");

	const links = {
		home: {
			label: t("links.home"),
			href: createHref({ pathname: "/" }),
		},
		geo: {
			label: t("links.geo-visualisation"),
			href: createHref({ pathname: "/geo-visualisation" }),
		},
		network: {
			label: t("links.network-visualisation"),
			href: createHref({ pathname: "/network-visualisation" }),
		},
	};

	return (
		<header className="border-b border-neutral-200">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-4 text-sm font-medium">
				<div className="shrink-0">
					<Link
						className="hover:text-primary-700 focus-visible:text-primary-700"
						href={links.home.href}
					>
						{links.home.label}
					</Link>
					{/* <strong className="ml-4">(work in progress)</strong> */}
				</div>
				<nav>
					<ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2" role="list">
						{Object.entries(links).map(([id, link]) => {
							if (id === "home") return null;

							return (
								<li key={id}>
									<Link
										className="hover:text-primary-700 focus-visible:text-primary-700"
										href={link.href}
									>
										{link.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</header>
	);
}
