import { Listbox, Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'

interface ListboxMultipleProps {
  filterOptions: Array<string>
  type: string
  relationChange: (type: string, value: Array<string>) => void
}

export function ListboxMultiple(props: ListboxMultipleProps): JSX.Element {
  const { filterOptions, type, relationChange } = props

  const [options, setOptions] = useState<Array<string>>([])
  const [selectedOptions, setselectedOptions] = useState<Array<string>>([])

  useEffect(() => {
    if (filterOptions.length > 0) {
      setOptions(filterOptions)
      setselectedOptions(filterOptions)
    }
  }, [filterOptions])

  function isSelected(value: string) {
    return (
      selectedOptions.find((el) => {
        return el === value
      }) != null
    )
  }

  function handleSelect(values: Array<string>) {
    setselectedOptions(values)
    relationChange(type, values)
    values.length === 0 ? setChecked(false) : setChecked(true)
  }

  function handleChecked(checked: boolean) {
    const checkOptions = checked ? options : []
    setselectedOptions(checkOptions)
    relationChange(type, checkOptions)
  }

  const [checked, setChecked] = useState(true)

  return (
    <Listbox
      as="div"
      className="space-y-1"
      value={selectedOptions}
      multiple
      onChange={handleSelect}
    >
      {() => {
        return (
          <>
            <input
              type="checkbox"
              id={type}
              className="inline"
              checked={checked}
              onChange={(e) => {
                setChecked(!checked)
                handleChecked(e.target.checked)
              }}
            />
            <Listbox.Label
              className="block text-sm font-medium leading-5 text-gray-700"
              htmlFor={type}
            >
              {props.type}
            </Listbox.Label>
            <div className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button className="focus:shadow-outline-blue relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5">
                  <span className="block truncate">
                    {selectedOptions.length < 1
                      ? 'Select filters'
                      : `Selected ${type} (${selectedOptions.length})`}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
              </span>

              <Transition
                unmount={false}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
              >
                <Listbox.Options
                  static
                  className="shadow-xs max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
                >
                  {options.map((option) => {
                    const selected = isSelected(option)
                    return (
                      <Listbox.Option key={option} value={option}>
                        {({ active }) => {
                          return (
                            <div
                              className={`${
                                active ? 'bg-blue-600 text-white' : 'text-gray-900'
                              } relative cursor-default select-none py-2 pl-8 pr-4`}
                            >
                              <span
                                className={`${
                                  selected ? 'font-semibold' : 'font-normal'
                                } block truncate`}
                              >
                                {option}
                              </span>
                              {selected && (
                                <span
                                  className={`${
                                    active ? 'text-white' : 'text-blue-600'
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )
                        }}
                      </Listbox.Option>
                    )
                  })}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )
      }}
    </Listbox>
  )
}
