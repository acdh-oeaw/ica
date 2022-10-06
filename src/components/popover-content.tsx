import { assert } from '@stefanprobst/assert'

import { db } from '@/db'
import type { Place, Relation } from '@/db/types'
import type { PlaceContentArrays } from '@/features/map/persons-layer'

interface PopoverContentProps {
  place: Place
  content: PlaceContentArrays
  onClose: () => void
}

export function PopoverContent(props: PopoverContentProps): JSX.Element {
  const { content, onClose, place } = props

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="grid gap-0.5 font-sans" onClick={onClose}>
      <h3 className="font-medium">{place.label}</h3>
      <ul className="grid gap-0.5 text-xs" role="list">
        {content.persons.map((id) => {
          return <RelationsListItem key={id} id={id} place={place} />
        })}
        {content.institutions.map((id) => {
          return <RelationsListItem key={id} id={id} place={place} />
        })}
        {content.events.map((id) => {
          return <RelationsListItem key={id} id={id} place={place} />
        })}
      </ul>
    </div>
  )
}

interface RelationsListItemProps {
  id: Relation['id']
  place: Place
}

function RelationsListItem(props: RelationsListItemProps): JSX.Element {
  const { id, place } = props

  const relation = db.relations.get(id)
  assert(relation != null, 'Relation should exist.')

  const entity = relation.source.id === place.id ? relation.target : relation.source
  const type = relation.type

  function deduplicate(startDate: string | null, endDate: string | null) {
    if (startDate === endDate) return [startDate]
    return [startDate, endDate]
  }

  const dateRange = deduplicate(relation.startDateWritten, relation.endDateWritten)
    .filter(Boolean)
    .join(' – ')

  const label = [entity.label, type.label, dateRange.length > 0 ? `(${dateRange})` : null]
    .filter(Boolean)
    .join(' ')

  return <li key={relation.id}>{label}</li>
}
