import type { ReactNode } from "react";

interface PageLayoutProps {
	children: ReactNode;
}

export function AppLayout(props: PageLayoutProps): ReactNode {
	const { children } = props;

	return <div className="grid min-h-full grid-rows-[auto_1fr_auto]">{children}</div>;
}
