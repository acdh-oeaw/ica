import { Listbox, Transition } from "@headlessui/react";
import {
	CheckIcon as CheckMarkIcon,
	ChevronUpDownIcon as SelectorIcon,
} from "@heroicons/react/20/solid";
import { Fragment, type ReactNode } from "react";

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

export function SingleSelect<T extends Item>(props: SingleSelectProps<T>): JSX.Element {
	const { getColor, items, label, messages, name, onSelectionChange, selectedKey } = props;

	function getDisplayLabel(selectedKey: Item["id"]) {
		return items.get(selectedKey)?.label ?? messages.placeholder;
	}

	return (
		<Listbox
			as="div"
			className="relative"
			name={name}
			onChange={onSelectionChange}
			value={selectedKey}
		>
			<div className="grid gap-y-1">
				<Listbox.Label className="text-xs font-medium text-neutral-600">{label}</Listbox.Label>
				<Listbox.Button className="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-0 py-2 pl-3 pr-10 text-left text-sm shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300">
					<span className="block truncate">{getDisplayLabel(selectedKey)}</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<SelectorIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
					</span>
				</Listbox.Button>
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
				<Listbox.Options className="absolute z-overlay mt-1 max-h-96 w-full overflow-auto rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none">
					{Array.from(items.values()).map((item) => {
						const { backgroundColor } = getColor?.(item.id) ?? defaultSelectionColor;

						return (
							<Listbox.Option
								key={item.id}
								className="relative cursor-default select-none py-2 pl-10 pr-4 ui-active:bg-neutral-100 ui-active:text-neutral-900"
								value={item.id}
							>
								{({ selected }) => {
									return (
										<Fragment>
											<span className="block truncate ui-selected:font-medium">{item.label}</span>
											{selected ? (
												<span
													className="absolute inset-y-0 left-0 grid place-items-center pl-3"
													style={{ color: backgroundColor }}
												>
													<CheckMarkIcon aria-hidden className="h-5 w-5" />
												</span>
											) : null}
										</Fragment>
									);
								}}
							</Listbox.Option>
						);
					})}
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
}
