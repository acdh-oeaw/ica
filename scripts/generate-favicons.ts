import fs from "node:fs/promises";
import path from "node:path";

import { log } from "@acdh-oeaw/lib";
import generateFavicons, { generateSocialImage } from "@stefanprobst/favicons";

import { createAssetLink } from "@/lib/create-asset-link";
import { manifestFileName, metadata, openGraphImageName } from "~/config/metadata.config";

async function generate(): Promise<void> {
	const publicFolder = path.join(process.cwd(), "public");

	await Promise.all(
		Object.values(metadata).map(async (config) => {
			const inputFilePath = path.join(process.cwd(), config.logo.path);
			const outputFolder = path.join(publicFolder, createAssetLink({ locale: config.locale }));

			await generateFavicons({
				inputFilePath,
				manifestFileName,
				maskable: config.logo.maskable,
				name: config.title,
				outputFolder,
				shortName: config.shortTitle,
			});

			if (path.extname(inputFilePath) === ".svg") {
				await fs.copyFile(inputFilePath, path.join(outputFolder, "icon.svg"));
			}

			await generateSocialImage(
				path.join(process.cwd(), config.image.path),
				path.join(outputFolder, openGraphImageName),
				{ fit: config.image.fit },
			);
		}),
	);
}

generate()
	.then(() => {
		log.success("Successfully generated favicons.");
	})
	.catch((error) => {
		log.error("Failed to generate favicons.\n", String(error));
	});
