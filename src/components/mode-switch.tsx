import { Switch } from '@headlessui/react'
import cx from 'clsx'

interface ModeSwitchProps {
  isSinglePersonMode: boolean
  setSinglePersonMode: (isSinglePersonMode: boolean) => void
}

export function ModeSwitch(props: ModeSwitchProps): JSX.Element {
  const { isSinglePersonMode, setSinglePersonMode } = props

  return (
    <div>
      <Switch
        checked={isSinglePersonMode}
        onChange={setSinglePersonMode}
        className={cx(
          'focus-visible:ring-opacity-75 relative inline-flex h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
          isSinglePersonMode ? 'bg-teal-900' : 'bg-teal-700',
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${isSinglePersonMode ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      Single Person Mode
    </div>
  )
}
