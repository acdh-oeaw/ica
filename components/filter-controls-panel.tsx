import type { FormEvent, ReactNode } from "react";

interface FilterControlsPanelProps {
	children: ReactNode;
	name: string;
}

export function FilterControlsPanel(props: FilterControlsPanelProps): ReactNode {
	const { children, name } = props;

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
	}

	return (
		<form
			className="flex flex-col gap-6 border-l border-neutral-200 p-6"
			id={name}
			name={name}
			noValidate={true}
			onSubmit={onSubmit}
			role="search"
		>
			{children}
		</form>
	);
}
