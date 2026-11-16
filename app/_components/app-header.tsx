import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NavLink } from "@/components/nav-link";
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
			<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 text-sm font-normal text-neutral-600 sm:px-8">
				<div className="shrink-0">
					<NavLink
						className="py-1 text-neutral-900 hover:underline focus-visible:underline"
						href={links.home.href}
					>
						{links.home.label}
					</NavLink>
				</div>
				<nav>
					<ul className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2" role="list">
						{Object.entries(links).map(([id, link]) => {
							if (id === "home") return null;

							return (
								<li key={id}>
									<NavLink
										className="py-1 underline-offset-4 transition hover:text-neutral-900 focus-visible:text-neutral-900 aria-[current=page]:text-neutral-900 aria-[current=page]:underline aria-[current=page]:decoration-neutral-400"
										href={link.href}
									>
										{link.label}
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</header>
	);
}
