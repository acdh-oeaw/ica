declare module "*.svg" {
	// oxlint-disable-next-line no-restricted-imports
	import type { StaticImageData } from "next/image";

	const content: StaticImageData;

	export default content;
}
