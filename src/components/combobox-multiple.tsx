import { Combobox, Transition } from '@headlessui/react'
import { ArrowsUpDownIcon as SelectorIcon, CheckIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'

interface ComboboxMultipleProps {
  personList: Array<string>
  relationChange: (type: string, value: Array<string>) => void
}

export interface Ipeople {
  people: Array<string>
}

export function ComboboxMultiple(props: ComboboxMultipleProps): JSX.Element {
  const { personList: people, relationChange } = props

  const [selectedPeople, setSelectedPeople] = useState<Array<string>>([])

  useEffect(() => {
    if (people.length > 0) {
      setSelectedPeople(people)
    }
  }, [people])

  const [query, setQuery] = useState('')

  const filteredPeople: Array<string> =
    query === ''
      ? people
      : people.filter((person: string) => {
          return person.toLowerCase().includes(query.toLowerCase())
        })

  function handleChange(values: Array<string>) {
    setSelectedPeople(values)
    relationChange('Persons', values)
  }

  function handleChecked(checked: boolean) {
    if (checked) {
      setSelectedPeople(people)
      relationChange('Persons', people)
    } else {
      setSelectedPeople([])
      relationChange('Persons', [])
    }
  }

  const [checked, setChecked] = useState(true)

  return (
    <>
      <input
        type="checkbox"
        id={'Persons'}
        className="inline"
        checked={checked}
        onChange={(e) => {
          setChecked(!checked)
          handleChecked(e.target.checked)
        }}
      />
      {'Persons'}
      <Combobox value={selectedPeople} onChange={handleChange} multiple>
        <div className="relative mt-1">
          <div className="focus-visible:ring-opacity-75 relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => {
                setQuery(event.target.value)
              }}
              displayValue={(people: Array<string>) => {
                return `Selected Persons (${people.length})`
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              return setQuery('')
            }}
          >
            <Combobox.Options className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => {
                  return (
                    <Combobox.Option
                      key={person}
                      className={({ active }) => {
                        return `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                      }}
                      value={person}
                    >
                      {({ selected, active }) => {
                        return (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {person}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-teal-600'
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )
                      }}
                    </Combobox.Option>
                  )
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </>
  )
}
