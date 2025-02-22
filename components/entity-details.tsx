import { isNonEmptyString } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { db } from "@/db";
import type { EntityBase, Event, Institution, Person, Place } from "@/db/types";
import { createEntityUrl } from "@/lib/create-entity-url";

interface EntityDetailsProps {
	entity: EntityBase;
}

export function EntityDetails(props: EntityDetailsProps): ReactNode {
	const { entity } = props;

	switch (entity.kind) {
		case "event":
			return <Event id={entity.id} />;
		case "institution":
			return <Institution id={entity.id} />;
		case "person":
			return <Person id={entity.id} />;
		case "place":
			return <Place id={entity.id} />;
		case "work":
			return null;
	}
}

interface EventProps {
	id: Event["id"];
}

function Event(props: EventProps): ReactNode {
	const { id } = props;

	const t = useTranslations("EntityDetails");

	const event = db.events.get(id);

	if (event == null) return null;

	return (
		<div className="grid gap-y-6">
			<div className="grid gap-y-2">
				<div>
					<h2 className="text-lg font-medium text-neutral-600">{event.label}</h2>
				</div>
				<a
					aria-label={t("see-database-entry-for", { label: event.label })}
					className="text-xs underline hover:text-primary-700 focus-visible:text-primary-700"
					href={createEntityUrl(event)}
					target="_blank"
				>
					{t("see-database-entry")}
				</a>
			</div>
			<dl className="grid gap-y-3">
				{event.persons.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-persons")}
						</dt>
						<dd>
							{Array.from(event.persons)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.persons.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{event.places.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-places")}
						</dt>
						<dd>
							{Array.from(event.places)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.places.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{event.institutions.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-institutions")}
						</dt>
						<dd>
							{Array.from(event.institutions)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.institutions.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{event.events.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-events")}
						</dt>
						<dd>
							{Array.from(event.events)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.events.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
			</dl>
		</div>
	);
}

interface InstitutionProps {
	id: Institution["id"];
}

function Institution(props: InstitutionProps): ReactNode {
	const { id } = props;

	const t = useTranslations("EntityDetails");

	const institution = db.institutions.get(id);

	if (institution == null) return null;

	return (
		<div className="grid gap-y-6">
			<div className="grid gap-y-2">
				<div>
					<h2 className="text-lg font-medium text-neutral-600">{institution.label}</h2>
				</div>
				<a
					aria-label={t("see-database-entry-for", { label: institution.label })}
					className="text-xs underline hover:text-primary-700 focus-visible:text-primary-700"
					href={createEntityUrl(institution)}
					target="_blank"
				>
					{t("see-database-entry")}
				</a>
			</div>
			<dl className="grid gap-y-3">
				{institution.persons.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-persons")}
						</dt>
						<dd>
							{Array.from(institution.persons)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.persons.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{institution.places.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-places")}
						</dt>
						<dd>
							{Array.from(institution.places)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.places.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{institution.institutions.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-institutions")}
						</dt>
						<dd>
							{Array.from(institution.institutions)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.institutions.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{institution.events.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-events")}
						</dt>
						<dd>
							{Array.from(institution.events)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.events.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
			</dl>
		</div>
	);
}

interface PersonProps {
	id: Person["id"];
}

function Person(props: PersonProps): ReactNode {
	const { id } = props;

	const t = useTranslations("EntityDetails");

	const person = db.persons.get(id);

	if (person == null) return null;

	const hasStartDate = isNonEmptyString(person.startDateWritten);
	const hasEndDate = isNonEmptyString(person.endDateWritten);

	return (
		<div className="grid gap-y-6">
			<div className="grid gap-y-2">
				<div>
					<h2 className="text-lg font-medium text-neutral-600">{person.label}</h2>
					{hasStartDate || hasEndDate ? (
						<div className="text-xs text-neutral-600">
							{hasStartDate ? (
								<time dateTime={person.startDate ?? undefined}>{person.startDateWritten}</time>
							) : null}
							{hasStartDate && hasEndDate ? <span> &ndash; </span> : null}
							{hasStartDate ? (
								<time dateTime={person.endDate ?? undefined}>{person.endDateWritten}</time>
							) : null}
						</div>
					) : null}
				</div>
				<a
					aria-label={t("see-database-entry-for", { label: person.label })}
					className="text-xs underline hover:text-primary-700 focus-visible:text-primary-700"
					href={createEntityUrl(person)}
					target="_blank"
				>
					{t("see-database-entry")}
				</a>
			</div>
			<dl className="grid gap-y-3">
				{person.professions.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.professions")}
						</dt>
						<dd>
							{Array.from(person.professions)
								.map((id) => {
									return db.professions.get(id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{isNonEmptyString(person.notes) ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.notes")}
						</dt>
						<dd>{person.notes}</dd>
					</div>
				) : null}
				{isNonEmptyString(person.references) ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.references")}
						</dt>
						<dd>{person.references}</dd>
					</div>
				) : null}
				{person.persons.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-places")}
						</dt>
						<dd>
							{Array.from(person.persons)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.persons.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{person.places.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-places")}
						</dt>
						<dd>
							{Array.from(person.places)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.places.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{person.institutions.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-institutions")}
						</dt>
						<dd>
							{Array.from(person.institutions)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.institutions.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{person.events.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-events")}
						</dt>
						<dd>
							{Array.from(person.events)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.events.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
			</dl>
		</div>
	);
}

interface PlaceProps {
	id: Place["id"];
}

function Place(props: PlaceProps): ReactNode {
	const { id } = props;

	const t = useTranslations("EntityDetails");

	const place = db.places.get(id);

	if (place == null) return null;

	return (
		<div className="grid gap-y-6">
			<div className="grid gap-y-2">
				<div>
					<h2 className="text-lg font-medium text-neutral-600">{place.label}</h2>
				</div>
				<a
					aria-label={t("see-database-entry-for", { label: place.label })}
					className="text-xs underline hover:text-primary-700 focus-visible:text-primary-700"
					href={createEntityUrl(place)}
					target="_blank"
				>
					{t("see-database-entry")}
				</a>
			</div>
			<dl className="grid gap-y-3">
				{place.persons.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-persons")}
						</dt>
						<dd>
							{Array.from(place.persons)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.persons.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{place.places.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-places")}
						</dt>
						<dd>
							{Array.from(place.places)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.places.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{place.institutions.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-institutions")}
						</dt>
						<dd>
							{Array.from(place.institutions)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.institutions.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
				{place.events.size > 0 ? (
					<div className="grid gap-1 text-sm">
						<dt className="text-xs font-medium uppercase tracking-wide text-neutral-600">
							{t("details.related-events")}
						</dt>
						<dd>
							{Array.from(place.events)
								.map((id) => {
									const relation = db.relations.get(id);
									if (relation == null) return null;
									const target =
										relation.source.id === props.id ? relation.target : relation.source;
									return db.events.get(target.id)?.label;
								})
								.filter(isNonEmptyString)
								.join(", ")}
						</dd>
					</div>
				) : null}
			</dl>
		</div>
	);
}
