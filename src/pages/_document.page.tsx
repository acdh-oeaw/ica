/* eslint-disable check-file/filename-naming-convention */

import { InitialThemeScript } from "@stefanprobst/next-theme";
import { Head, Html, Main, NextScript } from "next/document";
import type { ReactNode } from "react";

export default function Document(): ReactNode {
	return (
		<Html>
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
