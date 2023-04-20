import { type ReactNode } from "react";

import { mainContentId } from "@/components/skip-nav";

interface MainContentProps {
	children?: ReactNode;
	className?: string;
}

export function MainContent(props: MainContentProps): JSX.Element {
	const { children, className } = props;

	return (
		<main className={className} id={mainContentId} tabIndex={-1}>
			{children}
		</main>
	);
}
