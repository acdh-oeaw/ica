import { isNonNullable } from "@acdh-oeaw/lib";
import { Combobox, Transition } from "@headlessui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	CheckIcon as CheckMarkIcon,
	ChevronsUpDownIcon as SelectorIcon,
	XIcon as RemoveIcon,
} from "lucide-react";
import { type ChangeEvent, Fragment, type ReactNode, useMemo, useState } from "react";

import { useElementRef } from "@/lib/use-element-ref";

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
		removeSelectedKey: (label: T["label"]) => string;
	};
	name: string;
	onSelectionChange: (selectedKeys: Array<T["id"]>) => void;
	selectedKeys: Array<T["id"]>;
}

export function MultiComboBox<T extends Item>(props: MultiComboBoxProps<T>): ReactNode {
	const { getColor, items, label, messages, name, onSelectionChange, selectedKeys } = props;

	const [searchTerm, setSearchTerm] = useState("");

	function onInputChange(event: ChangeEvent<HTMLInputElement>): void {
		setSearchTerm(event.currentTarget.value);
	}

	function getDisplayLabel(key: unknown): string {
		return items.get(key as T["id"])?.label ?? "";
	}

	const visibleItems = useMemo(() => {
		const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(isNonNullable);

		if (searchTerms.length === 0) return Array.from(items.values());

		const visibleItems: Array<Item> = [];

		items.forEach((option) => {
			const label = option.label.toLowerCase();
			if (
				searchTerms.some((searchTerm) => {
					return label.includes(searchTerm);
				})
			) {
				visibleItems.push(option);
			}
		});

		return visibleItems;
	}, [items, searchTerm]);

	const [element, setElement] = useElementRef();
	const virtualizer = useVirtualizer({
		count: visibleItems.length,
		estimateSize() {
			return 36;
		},
		getItemKey(index) {
			return visibleItems[index]!.id;
		},
		getScrollElement() {
			return element;
		},
		overscan: 10,
	});

	const height = virtualizer.getTotalSize();
	const virtualItems = virtualizer.getVirtualItems();

	return (
		<Combobox
			as="div"
			className="relative"
			multiple={true}
			name={name}
			onChange={onSelectionChange}
			value={selectedKeys}
		>
			<div className="grid gap-y-1">
				<Combobox.Label className="text-xs font-medium text-neutral-600">{label}</Combobox.Label>
				<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-0 text-left text-sm shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300">
					{selectedKeys.length > 0 ? (
						<ul className="flex flex-wrap gap-2 p-2 text-xs" role="list">
							{selectedKeys.map((key) => {
								function onRemoveSelectedKey(): void {
									onSelectionChange(
										selectedKeys.filter((_key) => {
											return _key !== key;
										}),
									);
								}

								const { backgroundColor, color } = getColor?.(key) ?? defaultSelectionColor;

								return (
									<li
										key={key}
										className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium"
										style={{ backgroundColor, color }}
									>
										<span className="block truncate">{getDisplayLabel(key)}</span>
										<button onClick={onRemoveSelectedKey} type="button">
											<span className="sr-only">
												{messages.removeSelectedKey(getDisplayLabel(key))}
											</span>
											<RemoveIcon aria-hidden={true} className="size-3" />
										</button>
									</li>
								);
							})}
						</ul>
					) : null}
					<div className="relative">
						<Combobox.Input
							autoComplete="off"
							className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus-visible:outline-none"
							onChange={onInputChange}
							placeholder={messages.placeholder}
							value={searchTerm}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400">
							<SelectorIcon aria-hidden={true} className="size-5" />
						</Combobox.Button>
					</div>
				</div>
			</div>
			<Transition
				as={Fragment}
				enter="transition duration-100 ease-out"
				enterFrom="transform scale-95 opacity-0"
				enterTo="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="transform scale-100 opacity-100"
				leaveTo="transform scale-95 opacity-0"
			>
				<Combobox.Options className="absolute z-overlay mt-1 w-full rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none">
					{searchTerm !== "" && visibleItems.length === 0 ? (
						<div className="relative cursor-default select-none px-4 py-2 text-neutral-700">
							{messages.nothingFound}
						</div>
					) : null}
					<div ref={setElement} className="max-h-96 overflow-auto">
						<div className="relative w-full" style={{ height }}>
							{virtualItems.map((virtualItem) => {
								const item = visibleItems[virtualItem.index]!;
								const { backgroundColor } = getColor?.(item.id) ?? defaultSelectionColor;

								return (
									<Combobox.Option
										key={item.id}
										className="absolute left-0 top-0 w-full cursor-default select-none py-2 pl-10 pr-4 ui-active:bg-neutral-100 ui-active:text-neutral-900"
										style={{
											height: virtualItem.size,
											transform: `translateY(${String(virtualItem.start)}px)`,
										}}
										value={item.id}
									>
										{({ selected }) => {
											return (
												<Fragment>
													<span className="block truncate ui-selected:font-medium">
														{item.label}
													</span>
													{selected ? (
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
									</Combobox.Option>
								);
							})}
						</div>
					</div>
				</Combobox.Options>
			</Transition>
		</Combobox>
	);
}
