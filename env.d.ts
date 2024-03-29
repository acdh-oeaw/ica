type DistributivePick<T, K extends PropertyType> = T extends unknown ? Pick<T, K> : never;

type HtmlString = string;

type IsoDateString = string;

type Primitive = boolean | number | string;

type PageParamsInput = {
	[K: string]: Array<Primitive> | Primitive;
};

type PageParams<T extends PageParamsInput> = {
	[K in keyof T as string extends K ? never : K]: Exclude<T[K], undefined> extends Primitive
		? string
		: Array<string>;
};

declare module "*.svg" {
	import { type StaticImageData } from "next/image";

	const content: StaticImageData;

	export default content;
}
