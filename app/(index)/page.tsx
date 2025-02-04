import { readFile } from "node:fs/promises";
import { join } from "node:path";

import MarkdownIt from "markdown-it";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { createHref } from "@/lib/create-href";
import hero from "@/public/assets/images/hero.jpg";

async function getHeroSectionContent(): Promise<string> {
	const filePath = join(process.cwd(), "content", "en", "index-page", "index.mdx");
	const fileContent = await readFile(filePath, { encoding: "utf-8" });
	const renderer = new MarkdownIt();
	const html = renderer.render(fileContent);
	return html;
}

interface IndexPageProps extends Record<string, never> {}

export default async function IndexPage(_props: Readonly<IndexPageProps>): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	const links = {
		geo: {
			label: t("explore-map"),
			href: createHref({ pathname: "/geo-visualisation" }),
		},
		network: {
			label: t("explore-graph"),
			href: createHref({ pathname: "/network-visualisation" }),
		},
	};

	return (
		<MainContent>
			<section className="relative border-y border-neutral-200 bg-background">
				<Image
					alt=""
					className="absolute inset-0 size-full object-cover opacity-40"
					decoding="sync"
					priority={true}
					sizes="100vw"
					src={hero}
				/>
				<div className="relative mx-auto max-w-7xl p-8">
					<div className="grid justify-items-center gap-4 py-32">
						<h1 className="text-center text-5xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
							{t("title")}
						</h1>
						<h2 className="max-w-2xl text-center text-2xl font-extrabold tracking-tight md:text-3xl">
							{t("lead-in")}
						</h2>
						<div className="mx-auto mt-4 flex flex-col gap-4 xs:flex-row">
							{Object.entries(links).map(([id, link]) => {
								return (
									<Link
										key={id}
										className="inline-flex rounded-md bg-primary-600 px-12 py-4 text-center font-medium text-neutral-0 hover:bg-primary-700 hover:text-neutral-0 focus-visible:bg-primary-700 focus-visible:ring"
										href={link.href}
									>
										{link.label}
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</section>

			<section>
				<div className="mx-auto w-full max-w-7xl p-8">
					<div
						dangerouslySetInnerHTML={{ __html: await getHeroSectionContent() }}
						className="mx-auto grid w-full max-w-2xl items-start gap-4 font-medium leading-relaxed"
					/>
				</div>
			</section>
		</MainContent>
	);
}
