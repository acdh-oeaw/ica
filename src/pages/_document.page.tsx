/* eslint-disable check-file/filename-naming-convention */

import { InitialThemeScript } from "@stefanprobst/next-theme";
import { Head, Html, Main, NextScript } from "next/document";
import type { ReactNode } from "react";

import * as fonts from "@/lib/fonts";

export default function Document(): ReactNode {
	return (
		<Html className={fonts.body.variable}>
			<Head>
				<InitialThemeScript />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
