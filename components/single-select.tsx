import { CheckIcon as CheckMarkIcon, ChevronsUpDownIcon as SelectorIcon } from "lucide-react";
import { Fragment, type ReactNode, useMemo } from "react";
import { useIsSSR } from "react-aria";
import {
	Button,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Select,
	SelectValue,
} from "react-aria-components";

const defaultSelectionColor: SelectionColor = { backgroundColor: "#1b1e28", color: "#fff" };

interface SelectionColor {
	backgroundColor: string;
	color: string;
}

interface Item {
	id: string;
	label: string;
}

interface SingleSelectProps<T extends Item> {
	getColor?: (id: T["id"]) => SelectionColor;
	items: Map<T["id"], T>;
	label: ReactNode;
	messages: {
		placeholder: string;
	};
	name: string;
	onSelectionChange: (selectedKey: T["id"]) => void;
	selectedKey: T["id"];
}

export function SingleSelect<T extends Item>(props: SingleSelectProps<T>): ReactNode {
	const { getColor, items, label, messages, name, onSelectionChange, selectedKey } = props;
	const isSSR = useIsSSR();
	const options = useMemo(() => {
		return Array.from(items.values());
	}, [items]);

	return (
		<Select
			isDisabled={isSSR}
			className="relative grid gap-y-1"
			name={name}
			placeholder={messages.placeholder}
			value={selectedKey}
			onChange={(key) => {
				if (key != null) onSelectionChange(String(key));
			}}
		>
			<Label className="text-xs font-medium text-neutral-600">{label}</Label>
			<Button className="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-0 py-2 pl-3 pr-10 text-left text-sm shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300">
				<SelectValue className="block truncate" />
				<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					<SelectorIcon aria-hidden={true} className="size-5 text-neutral-400" />
				</span>
			</Button>
			<Popover
				className="z-overlay max-h-[min(24rem,var(--available-height))] w-[var(--trigger-width)] overflow-hidden rounded-md bg-neutral-0 text-sm shadow-lg ring-1 ring-neutral-1000/5 entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95"
				offset={4}
			>
				<ListBox
					className="max-h-[inherit] overflow-y-auto overscroll-contain py-1 outline-none"
					items={options}
				>
					{(item) => {
						const { backgroundColor } = getColor?.(item.id) ?? defaultSelectionColor;
						return (
							<ListBoxItem
								id={item.id}
								textValue={item.label}
								className={({ isFocused, isHovered }) => {
									return `relative cursor-default select-none py-2 pl-10 pr-4 outline-none ${isFocused || isHovered ? "bg-neutral-200 text-neutral-900" : "text-neutral-700"}`;
								}}
							>
								{({ isSelected }) => {
									return (
										<Fragment>
											<span
												className={isSelected ? "block truncate font-medium" : "block truncate"}
											>
												{item.label}
											</span>
											{isSelected ? (
												<span
													className="absolute inset-y-0 left-0 grid place-items-center pl-3"
													style={{ color: backgroundColor }}
												>
													<CheckMarkIcon aria-hidden={true} className="size-5" />
												</span>
											) : null}
										</Fragment>
									);
								}}
							</ListBoxItem>
						);
					}}
				</ListBox>
			</Popover>
		</Select>
	);
}
