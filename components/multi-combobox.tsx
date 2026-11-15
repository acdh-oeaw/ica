import {
	CheckIcon as CheckMarkIcon,
	ChevronsUpDownIcon as SelectorIcon,
	XIcon as RemoveIcon,
} from "lucide-react";
import { Fragment, type ReactNode, useId, useMemo } from "react";
import { useIsSSR } from "react-aria";
import {
	Button,
	ComboBox,
	ComboBoxValue,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	ListLayout,
	Popover,
	Tag,
	TagGroup,
	TagList,
	Virtualizer,
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

interface MultiComboBoxProps<T extends Item> {
	getColor?: (id: T["id"]) => SelectionColor;
	items: Map<T["id"], T>;
	label: ReactNode;
	messages: {
		nothingFound: ReactNode;
		placeholder: string;
	};
	name: string;
	onSelectionChange: (selectedKeys: Array<T["id"]>) => void;
	selectedKeys: Array<T["id"]>;
}

export function MultiComboBox<T extends Item>(props: MultiComboBoxProps<T>): ReactNode {
	const { getColor, items, label, messages, name, onSelectionChange, selectedKeys } = props;
	const isSSR = useIsSSR();
	const labelId = useId();
	const options = useMemo(() => {
		return Array.from(items.values());
	}, [items]);
	const selectedItems = selectedKeys.flatMap((key) => {
		const item = items.get(key);
		return item != null ? [item] : [];
	});

	return (
		<ComboBox
			isDisabled={isSSR}
			className="relative grid gap-y-1"
			selectionMode="multiple"
			name={name}
			defaultItems={options}
			value={selectedKeys}
			allowsEmptyCollection={true}
			defaultFilter={(text, input) => {
				return input
					.toLowerCase()
					.split(/\s+/)
					.some((term) => {
						return text.toLowerCase().includes(term);
					});
			}}
			onChange={(keys) => {
				onSelectionChange(keys.map(String));
			}}
		>
			<Label id={labelId} className="text-xs font-medium text-neutral-600">
				{label}
			</Label>
			<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-0 text-left text-sm shadow-md focus-within:ring-2 focus-within:ring-primary-300">
				<ComboBoxValue>
					{() => {
						return selectedItems.length > 0 ? (
							<TagGroup
								aria-labelledby={labelId}
								onRemove={(keys) => {
									onSelectionChange(
										selectedKeys.filter((key) => {
											return !keys.has(key);
										}),
									);
								}}
							>
								<TagList className="flex flex-wrap gap-2 p-2 text-xs" items={selectedItems}>
									{(item) => {
										const color = getColor?.(item.id) ?? defaultSelectionColor;
										return (
											<Tag
												id={item.id}
												textValue={item.label}
												className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
												style={{ ...color }}
											>
												{item.label}
												<Button slot="remove">
													<RemoveIcon aria-hidden={true} className="size-3" />
												</Button>
											</Tag>
										);
									}}
								</TagList>
							</TagGroup>
						) : null;
					}}
				</ComboBoxValue>
				<div className="relative">
					<Input
						autoComplete="off"
						className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 outline-none"
						placeholder={messages.placeholder}
					/>
					<Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400">
						<SelectorIcon aria-hidden={true} className="size-5" />
					</Button>
				</div>
			</div>
			<Popover
				className="z-overlay max-h-[min(24rem,var(--available-height))] w-[var(--trigger-width)] overflow-hidden rounded-md bg-neutral-0 text-sm shadow-lg ring-1 ring-neutral-1000/5 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out"
				offset={4}
			>
				<Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 36 }}>
					<ListBox
						className="max-h-[inherit] overflow-y-auto overscroll-contain py-1 outline-none"
						renderEmptyState={() => {
							return <div className="px-4 py-2 text-neutral-700">{messages.nothingFound}</div>;
						}}
					>
						{(item: T) => {
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
				</Virtualizer>
			</Popover>
		</ComboBox>
	);
}
