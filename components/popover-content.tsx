import { isNonNullable } from "@acdh-oeaw/lib";
import { Fragment, type ReactNode } from "react";

import type { SerializablePlaceRelationsMap } from "@/app/geo-visualisation/_components/persons-layer";
import { db } from "@/db";
import type { Place, Relation } from "@/db/types";
import { createEntityUrl } from "@/lib/create-entity-url";

interface PopoverContentProps {
	place: Place;
	relations: SerializablePlaceRelationsMap;
}

export function PopoverContent(props: PopoverContentProps): ReactNode {
	const { relations, place } = props;

	return (
		<div className="grid gap-1 font-sans">
			<h3 className="text-xs font-medium">
				<a className="underline decoration-dotted" href={createEntityUrl(place)} target="_blank">
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

function RelationsLabel(props: RelationsListItemProps): ReactNode {
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
							rel="noreferrer"
							target="_blank"
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
