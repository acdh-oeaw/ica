import { Switch } from '@headlessui/react'
import { useState } from 'react'

interface ModeSwitchProps {
  setSinglePerson: (onOff: boolean) => void
}

export function ModeSwitch(props: ModeSwitchProps): JSX.Element {
  const [enabled, setEnabled] = useState(false)

  function handleChange(e: boolean) {
    setEnabled(e)
    props.setSinglePerson(e)
  }

  return (
    <div>
      <Switch
        checked={enabled}
        onChange={handleChange}
        className={`${enabled ? 'bg-teal-900' : 'bg-teal-700'}
          focus-visible:ring-opacity-75 relative inline-flex h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none  focus-visible:ring-2 focus-visible:ring-white`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      Single Person Mode
    </div>
  )
}
