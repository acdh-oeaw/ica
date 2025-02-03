import type { AppProps as NextAppProps } from "next/app";
import type { ReactNode } from "react";

import type { DictionariesProps } from "@/lib/i18n/dictionaries";

export type SharedPageProps = DictionariesProps<"common">;

export type GetLayout = (page: ReactNode, pageProps: SharedPageProps) => ReactNode;

export type PageComponent = NextAppProps<SharedPageProps>["Component"] & {
	getLayout?: GetLayout;
};

export interface AppProps extends NextAppProps<SharedPageProps> {
	Component: PageComponent;
}
