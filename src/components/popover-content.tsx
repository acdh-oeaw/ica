import { db } from '@/db'
import type { Place, Relation } from '@/db/types'
import type { SerializablePlaceRelationsMap } from '@/features/map/persons-layer'
import { isNonNullable } from '@/lib/is-non-nullable'

interface PopoverContentProps {
  onClose: () => void
  place: Place
  relations: SerializablePlaceRelationsMap
}

export function PopoverContent(props: PopoverContentProps): JSX.Element {
  const { relations, onClose, place } = props

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="grid gap-0.5 font-sans" onClick={onClose}>
      <h3 className="text-xs font-medium">{place.label}</h3>
      <ul className="grid gap-0.5 text-xs" role="list">
        {relations.map(([key, ids]) => {
          return (
            <li key={key}>
              <RelationsLabel ids={ids} place={place} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface RelationsListItemProps {
  ids: Array<Relation['id']>
  place: Place
}

function RelationsLabel(props: RelationsListItemProps): JSX.Element {
  const { ids } = props

  const relations = ids
    .map((id) => {
      return db.relations.get(id)
    })
    .filter(isNonNullable)

  function deduplicateDates(startDate: string | null, endDate: string | null) {
    if (startDate === endDate) return [startDate]
    return [startDate, endDate]
  }

  function createRelationLabel(relation: Relation) {
    const dateRange = deduplicateDates(relation.startDateWritten, relation.endDateWritten)
      .filter(isNonNullable)
      .join(' – ')

    const label = [
      relation.source.label,
      relation.type.label,
      dateRange.length > 0 ? `(${dateRange})` : null,
    ]
      .filter(isNonNullable)
      .join(' ')

    return label
  }

  const label = relations.map(createRelationLabel).join(' ')

  return <li>{label}</li>
}
