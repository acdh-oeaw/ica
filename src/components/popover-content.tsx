import { Fragment } from "react";

import { db } from "@/db";
import { type Place, type Relation } from "@/db/types";
import { type SerializablePlaceRelationsMap } from "@/features/map/persons-layer";
import { createEntityUrl } from "@/lib/create-entity-url";
import { isNonNullable } from "@/lib/is-non-nullable";

interface PopoverContentProps {
	place: Place;
	relations: SerializablePlaceRelationsMap;
}

export function PopoverContent(props: PopoverContentProps): JSX.Element {
	const { relations, place } = props;

	return (
		<div className="grid gap-1 font-sans">
			<h3 className="text-xs font-medium">
				<a
					className="underline decoration-dotted"
					href={createEntityUrl(place)}
					target="_blank"
					rel="noreferrer"
				>
					{place.label}
				</a>
			</h3>
			<ul className="grid gap-0.5 text-xs" role="list">
				{relations.map(([key, ids]) => {
					return (
						<li key={key}>
							<RelationsLabel ids={ids} place={place} />
						</li>
					);
				})}
			</ul>
		</div>
	);
}

interface RelationsListItemProps {
	ids: Array<Relation["id"]>;
	place: Place;
}

function RelationsLabel(props: RelationsListItemProps): JSX.Element {
	const { ids } = props;

	const relations = ids
		.map((id) => {
			return db.relations.get(id);
		})
		.filter(isNonNullable);

	function getDateRange(startDate: string | null, endDate: string | null) {
		const value = [];

		if (startDate != null) value.push(startDate);
		if (endDate != null && endDate !== startDate) value.push(endDate);

		return value.join(" - ");
	}

	return (
		<Fragment>
			{relations.map((relation, index) => {
				const dateRange = getDateRange(relation.startDateWritten, relation.endDateWritten);

				return (
					<span key={relation.id}>
						{index !== 0 ? ", " : null}
						<a
							className="underline decoration-dotted underline-offset-0"
							href={createEntityUrl(relation.source)}
							target="_blank"
							rel="noreferrer"
						>
							{relation.source.label}
						</a>
						<span> {relation.type.label} </span>
						<span>{dateRange.length > 0 ? `(${dateRange})` : null}</span>
					</span>
				);
			})}
		</Fragment>
	);
}
