import { type AppProps as NextAppProps } from "next/app";

import { type DictionariesProps } from "@/lib/i18n/dictionaries";

export type SharedPageProps = DictionariesProps<"common">;

export interface GetLayout {
	(page: JSX.Element, pageProps: SharedPageProps): JSX.Element;
}

export type PageComponent = NextAppProps<SharedPageProps>["Component"] & {
	getLayout?: GetLayout;
};

export interface AppProps extends NextAppProps<SharedPageProps> {
	Component: PageComponent;
}
