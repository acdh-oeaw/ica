import type { FormEvent, ReactNode } from 'react'

interface FilterControlsPanelProps {
  children: ReactNode
  name: string
}

export function FilterControlsPanel(props: FilterControlsPanelProps): JSX.Element {
  const { children, name } = props

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 px-8 py-4">
      <form
        className="pointer-events-auto ml-auto grid max-w-lg gap-8 rounded-md bg-neutral-0 px-4 py-4 shadow-lg"
        id={name}
        name={name}
        noValidate
        onSubmit={onSubmit}
        role="search"
      >
        {children}
      </form>
    </div>
  )
}
