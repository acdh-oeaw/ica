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
    <form
      className="grid content-start gap-6 border-l border-neutral-200 px-8 py-8"
      id={name}
      name={name}
      noValidate
      onSubmit={onSubmit}
      role="search"
    >
      {children}
    </form>
  )
}
