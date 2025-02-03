import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { useI18n } from "@/lib/i18n/use-i18n";
import { useAppMetadata } from "@/lib/metadata/use-app-metadata";
import * as routes from "@/lib/route/routes";
import hero from "@/public/assets/images/hero.jpg";

export function HomeHeroSection(): ReactNode {
	const { t } = useI18n<"common">();
	const metadata = useAppMetadata();

	return (
		<Fragment>
			<section className="relative border-y border-primary-200 bg-primary-50">
				<Image
					alt=""
					className="absolute inset-0 size-full object-cover opacity-40"
					loading="lazy"
					src={hero}
				/>
				<div className="relative mx-auto max-w-7xl p-8">
					<div className="grid justify-items-center gap-4 py-32">
						<h1 className="text-center text-5xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
							{metadata.title}
						</h1>
						<h2 className="max-w-2xl text-center text-2xl font-extrabold tracking-tight md:text-3xl">
							{metadata.description}
						</h2>
						<div className="mx-auto mt-4 flex flex-col gap-4 xs:flex-row">
							<Link
								className="inline-flex rounded-md bg-primary-600 px-12 py-4 text-center font-medium text-neutral-0 hover:bg-primary-700 hover:text-neutral-0 focus-visible:bg-primary-700 focus-visible:ring"
								href={routes.geoVisualisation()}
							>
								{t(["common", "home", "explore-map"])}
							</Link>
							<Link
								className="inline-flex rounded-md bg-primary-600 px-12 py-4 text-center font-medium text-neutral-0 hover:bg-primary-700 hover:text-neutral-0 focus-visible:bg-primary-700 focus-visible:ring"
								href={routes.networkVisualisation()}
							>
								{t(["common", "home", "explore-graph"])}
							</Link>
						</div>
					</div>
				</div>
			</section>
			<section>
				<div className="mx-auto w-full max-w-7xl p-8">
					<div
						className="mx-auto grid w-full max-w-2xl items-start gap-4 font-medium leading-relaxed"
						dangerouslySetInnerHTML={{ __html: t(["common", "home", "intro"]) }}
					/>
				</div>
			</section>
		</Fragment>
	);
}
