import { Listbox, Transition } from '@headlessui/react'
import {
  CheckIcon as CheckMarkIcon,
  ChevronUpDownIcon as SelectorIcon,
} from '@heroicons/react/20/solid'
import { type ReactNode, Fragment } from 'react'

const defaultSelectionColor: SelectionColor = { backgroundColor: '#1b1e28', color: '#fff' }

interface SelectionColor {
  backgroundColor: string
  color: string
}

interface Item {
  id: string
  label: string
}

interface SelectProps<T extends Item> {
  getColor?: (id: T['id']) => SelectionColor
  items: Map<T['id'], T>
  label: ReactNode
  messages: {
    placeholder: string
  }
  name: string
  onSelectionChange: (selectedKey: T['id']) => void
  selectedKey: T['id']
}

export function Select<T extends Item>(props: SelectProps<T>): JSX.Element {
  const { getColor, items, label, messages, name, onSelectionChange, selectedKey } = props

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
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-0 text-left text-sm shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300">
          <div className="relative">
            <Listbox.Button>{messages.placeholder}</Listbox.Button>
            <SelectorIcon aria-hidden className="h-5 w-5" />
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
        <Listbox.Options className="absolute z-overlay mt-1 w-full rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none">
          <div className="max-h-96 overflow-auto">
            <div className="relative w-full">
              {Array.from(items.values()).map((item) => {
                const { backgroundColor } = getColor?.(item.id) ?? defaultSelectionColor

                return (
                  <Listbox.Option
                    key={item.id}
                    className="absolute top-0 left-0 w-full cursor-default select-none py-2 pl-10 pr-4 ui-active:bg-neutral-100 ui-active:text-neutral-900"
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
                              <CheckMarkIcon aria-hidden className="h-5 w-5" />
                            </span>
                          ) : null}
                        </Fragment>
                      )
                    }}
                  </Listbox.Option>
                )
              })}
            </div>
          </div>
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
