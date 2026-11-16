import "@/app/(index)/landing-page.css";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ArrowDown, ArrowUpRight, MapPin, Network } from "lucide-react";
import MarkdownIt from "markdown-it";
import { getTranslations } from "next-intl/server";
import { Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { createHref } from "@/lib/create-href";

const headingFont = Source_Serif_4({
	display: "swap",
	subsets: ["latin", "latin-ext"],
	weight: "400",
	variable: "--_font-landing-heading",
});

export default async function IndexPage(): Promise<ReactNode> {
	const [t, content] = await Promise.all([
		getTranslations("IndexPage"),
		readFile(join(process.cwd(), "content", "en", "index-page", "index.mdx"), "utf-8"),
	]);
	const renderer = new MarkdownIt();
	const views = [
		{ id: "map", icon: MapPin, href: createHref({ pathname: "/geo-visualisation" }) },
		{ id: "graph", icon: Network, href: createHref({ pathname: "/network-visualisation" }) },
	] as const;

	return (
		<MainContent className={`landing-page ${headingFont.variable}`}>
			<section aria-labelledby="landing-title" className="landing-hero">
				<h1 id="landing-title">{t("title")}</h1>
				<div>
					<p className="landing-lead">{t("lead-in")}</p>
					<p className="landing-description">{t("description")}</p>
					<a className="landing-text-link" href="#explore">
						{t("start-exploring")} <ArrowDown aria-hidden="true" size={17} />
					</a>
				</div>
			</section>

			<nav aria-label={t("start-exploring")} className="landing-explore" id="explore">
				<div className="landing-views">
					{views.map(({ id, icon: Icon, href }) => {
						return (
							<Link key={id} className="landing-view" href={href}>
								<Icon
									aria-hidden="true"
									className="landing-view-icon"
									size={27}
									strokeWidth={1.4}
								/>
								<h2>{t(`views.${id}.title`)}</h2>
								<p>{t(`views.${id}.description`)}</p>
								<span className="landing-view-action">
									{t(id === "map" ? "explore-map" : "explore-graph")}
									<ArrowUpRight aria-hidden="true" size={20} />
								</span>
							</Link>
						);
					})}
				</div>
			</nav>

			<section aria-labelledby="about-title" className="landing-about">
				<div>
					<h2 id="about-title">{t("about-title")}</h2>
				</div>
				<div
					className="landing-prose"
					dangerouslySetInnerHTML={{ __html: renderer.render(content) }}
				/>
			</section>
		</MainContent>
	);
}
