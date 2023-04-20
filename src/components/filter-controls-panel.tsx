import { type FormEvent, type ReactNode } from "react";

interface FilterControlsPanelProps {
	children: ReactNode;
	name: string;
}

export function FilterControlsPanel(props: FilterControlsPanelProps): JSX.Element {
	const { children, name } = props;

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
	}

	return (
		<form
			className="flex flex-col gap-6 border-l border-neutral-200 p-6"
			id={name}
			name={name}
			noValidate
			onSubmit={onSubmit}
			role="search"
		>
			{children}
		</form>
	);
}
