import "@stefanprobst/request/fetch";

import fs from "node:fs/promises";
import path from "node:path";

import { assert } from "@stefanprobst/assert";
import { log } from "@stefanprobst/log";
import config from "@stefanprobst/prettier-config";
import type { RequestOptions } from "@stefanprobst/request";
import { createUrl, HttpError, request as _request } from "@stefanprobst/request";
import { timeout, TimeoutError } from "@stefanprobst/request/timeout";
import { type HierarchyNode, stratify } from "d3";
import { format } from "prettier";
import serialize from "serialize-javascript";

import type {
	Database,
	EntityBase,
	EntityKind,
	Event,
	Institution,
	Person,
	Place,
	ProfessionBase,
	Relation,
	RelationBase,
	RelationTypeBase,
} from "@/db/types";
import { isNonNullable } from "@/lib/is-non-nullable";
import { baseUrl } from "~/config/api.config";

type RelationType = RelationTypeBase & { parent_class?: { id: number } | null };
type Context = { getRelationType: (id: string) => RelationType };

/**
 * The ica api will time out when being hit with many requests,
 * so we retry requests after a grace period.
 */
async function request(...args: Parameters<typeof _request>) {
	try {
		const response = await _request(...args);

		return response;
	} catch (error) {
		if (error instanceof TimeoutError) {
			log.warn("Connection timed out. Retrying after 20s...");
			await new Promise((resolve) => {
				setTimeout(resolve, 20000);
			});
			return _request(...args);
		} else {
			throw error;
		}
	}
}

//

const options: RequestOptions = {
	responseType: "json",
	fetch: (timeout as (ms: number) => typeof global.fetch)(60000),
};
const collectionId = 13; /** `webclient` collection */
const limit = 1000;

//

interface ApisPaginatedResponse<T> {
	next: string | null;
	previous: string | null;
	count: number;
	limit: number;
	offset: number;
	results: Array<T>;
}

type ApisEntityType = "Event" | "Institution" | "Person" | "Place" | "Work";

interface ApisRelationBase {
	id: number;
	label: string;
	relation_type: ApisRelationTypeBase;
	related_entity: ApisRelatedEntity;
}

interface ApisRelationTypeBase {
	id: number;
	label: string;
}

interface ApisRelatedEntity {
	id: number;
	label: string;
	type: ApisEntityType;
}

interface ApisRelation {
	id: number;
	label: string;
	relation_type: ApisRelationTypeBase;
	start_date: string | null;
	end_date: string | null;
	start_date_written: string | null;
	end_date_written: string | null;
	// TODO: add fields for all the apis relation permutations
	related_person?: { id: number; label: string };
	related_personA?: { id: number; label: string };
	related_personB?: { id: number; label: string };
	related_place?: { id: number; label: string };
	related_placeA?: { id: number; label: string };
	related_placeB?: { id: number; label: string };
	related_institution?: { id: number; label: string };
	related_institutionA?: { id: number; label: string };
	related_institutionB?: { id: number; label: string };
	related_event?: { id: number; label: string };
	related_eventA?: { id: number; label: string };
	related_eventB?: { id: number; label: string };
	related_work?: { id: number; label: string };
	related_workA?: { id: number; label: string };
	related_workB?: { id: number; label: string };
}

interface ApisInstitutionBase {
	id: number;
	name: string;
	start_date: string | null;
	end_date: string | null;
	start_date_written: string | null;
	end_date_written: string | null;
	references: string | null;
	notes: string | null;
}

interface ApisInstitution extends ApisInstitutionBase {
	relations: Array<ApisRelationBase>;
}

interface ApisPersonBase {
	id: number;
	name: string;
	first_name: string;
	gender: string;
	start_date: string | null;
	end_date: string | null;
	start_date_written: string | null;
	end_date_written: string | null;
	references: string | null;
	notes: string | null;
	profession: Array<{ id: number; label: string }>;
}

interface ApisPerson extends ApisPersonBase {
	relations: Array<ApisRelationBase>;
}

interface ApisProfessionBase {
	id: number;
	label: string;
}

interface ApisPlaceBase {
	id: number;
	name: string;
	start_date: string | null;
	end_date: string | null;
	start_date_written: string | null;
	end_date_written: string | null;
	references: string | null;
	notes: string | null;
	lat: number;
	lng: number;
}

interface ApisPlace extends ApisPlaceBase {
	relations: Array<ApisRelationBase>;
}

interface ApisEventBase {
	id: number;
	name: string;
	start_date: string | null;
	end_date: string | null;
	start_date_written: string | null;
	end_date_written: string | null;
	references: string | null;
	notes: string | null;
}

interface ApisEvent extends ApisEventBase {
	relations: Array<ApisRelationBase>;
}

//

function createEvent(value: ApisEvent): Event {
	return {
		kind: "event",
		id: String(value.id),
		label: value.name,
		persons: new Set(),
		places: new Set(),
		institutions: new Set(),
		events: new Set(),
	};
}

function createInstitution(value: ApisInstitution): Institution {
	return {
		kind: "institution",
		id: String(value.id),
		label: value.name,
		persons: new Set(),
		places: new Set(),
		institutions: new Set(),
		events: new Set(),
	};
}

function createPerson(person: ApisPersonBase): Person {
	return {
		kind: "person",
		id: String(person.id),
		label: [person.first_name, person.name].filter(isNonNullable).join(" "),
		startDate: person.start_date,
		endDate: person.end_date,
		startDateWritten: person.start_date_written,
		endDateWritten: person.end_date_written,
		references: person.references,
		notes: person.notes,
		gender: person.gender,
		professions: new Set(),
		persons: new Set(),
		places: new Set(),
		institutions: new Set(),
		events: new Set(),
	};
}

function createPlace(value: ApisPlace): Place {
	return {
		kind: "place",
		id: String(value.id),
		label: value.name,
		coordinates: [value.lng, value.lat],
		persons: new Set(),
		places: new Set(),
		institutions: new Set(),
		events: new Set(),
	};
}

function createProfessionBase(value: ApisProfessionBase): ProfessionBase {
	return {
		kind: "profession",
		id: String(value.id),
		label: value.label,
	};
}

function createEntityBase(value: ApisRelationBase["related_entity"]): EntityBase {
	return {
		id: String(value.id),
		kind: value.type.toLowerCase() as EntityKind,
		label: value.label,
	};
}

function createRelationType(value: ApisRelationBase["relation_type"]): RelationTypeBase {
	return {
		id: String(value.id),
		label: value.label,
	};
}

function createRelationBase(source: EntityBase, value: ApisRelationBase): RelationBase {
	return {
		id: String(value.id),
		source: { id: source.id, kind: source.kind, label: source.label },
		target: createEntityBase(value.related_entity),
		type: createRelationType(value.relation_type),
	};
}

function createRelation(value: ApisRelation, base: RelationBase): Relation {
	return {
		...base,
		startDate: value.start_date,
		endDate: value.end_date,
		startDateWritten: value.start_date_written,
		endDateWritten: value.end_date_written,
	};
}

//

async function addPersonById(
	value: EntityBase,
	db: Database,
	collection: Set<Person["id"]>,
	context: Context,
): Promise<void> {
	if (db.persons.has(value.id)) return;

	const url = createUrl({ pathname: `entities/person/${value.id}/`, baseUrl });

	log.info(`Fetching person ${value.label}.`);
	const response = (await request(url, options)) as ApisPerson;

	const person = createPerson(response);
	db.persons.set(person.id, person);

	for (const value of response.profession) {
		const profession = createProfessionBase(value);
		db.professions.set(profession.id, profession);
		person.professions.add(profession.id);
	}

	for (const value of response.relations) {
		const kind = value.related_entity.type.toLowerCase();

		if (kind === "person") {
			/** we are only interested in persons in the `webclient` collection. */
			if (!collection.has(String(value.related_entity.id))) continue;

			const relation = await getRelation(person, value, db, context);
			await addPersonById(relation.target, db, collection, context);
			person.persons.add(relation.id);
			db.persons.get(relation.target.id)?.persons.add(relation.id);
		} else if (kind === "place") {
			const relation = await getRelation(person, value, db, context);
			person.places.add(relation.id);
			await addPlaceById(relation.target, db, context);
			db.places.get(relation.target.id)?.persons.add(relation.id);
		} else if (kind === "institution") {
			const relation = await getRelation(person, value, db, context);
			person.institutions.add(relation.id);
			await addInstitutionById(relation.target, db, context);
			db.institutions.get(relation.target.id)?.persons.add(relation.id);
		} else if (kind === "event") {
			const relation = await getRelation(person, value, db, context);
			person.events.add(relation.id);
			await addEventById(relation.target, db, context);
			db.events.get(relation.target.id)?.persons.add(relation.id);
		}
	}
}

async function addInstitutionById(
	value: EntityBase,
	db: Database,
	context: Context,
): Promise<void> {
	if (db.institutions.has(value.id)) return;

	const url = createUrl({ pathname: `entities/institution/${value.id}/`, baseUrl });

	log.info(`Fetching institution ${value.label}.`);
	const response = (await request(url, options)) as ApisInstitution;

	const institution = createInstitution(response);
	db.institutions.set(institution.id, institution);

	for (const value of response.relations) {
		const kind = value.related_entity.type.toLowerCase();

		if (kind === "place") {
			const relation = await getRelation(institution, value, db, context);
			institution.places.add(relation.id);
			await addPlaceById(relation.target, db, context);
			db.places.get(relation.target.id)?.institutions.add(relation.id);
		}
	}
}

async function addPlaceById(value: EntityBase, db: Database, context: Context): Promise<void> {
	if (db.places.has(value.id)) return;

	const url = createUrl({ pathname: `entities/place/${value.id}/`, baseUrl });

	log.info(`Fetching place ${value.label}.`);
	const response = (await request(url, options)) as ApisPlace;

	const place = createPlace(response);
	db.places.set(place.id, place);

	for (const value of response.relations) {
		const kind = value.related_entity.type.toLowerCase();

		if (kind === "place") {
			const relation = await getRelation(place, value, db, context);
			place.places.add(relation.id);
			await addPlaceById(relation.target, db, context);
			db.places.get(relation.target.id)?.places.add(relation.id);
		}
	}
}

async function addEventById(value: EntityBase, db: Database, context: Context): Promise<void> {
	if (db.events.has(value.id)) return;

	const url = createUrl({ pathname: `entities/event/${value.id}/`, baseUrl });

	log.info(`Fetching event ${value.label}.`);
	const response = (await request(url, options)) as ApisEvent;

	const event = createEvent(response);
	db.events.set(event.id, event);

	for (const value of response.relations) {
		const kind = value.related_entity.type.toLowerCase();

		if (kind === "place") {
			const relation = await getRelation(event, value, db, context);
			event.places.add(relation.id);
			await addPlaceById(relation.target, db, context);
			db.places.get(relation.target.id)?.events.add(relation.id);
		}
	}
}

async function addRelationById(value: RelationBase, db: Database, context: Context): Promise<void> {
	if (db.relations.has(value.id)) return;

	const order = ["person", "institution", "place", "event", "work"] as const;

	function sort(source: (typeof order)[number], target: (typeof order)[number]) {
		return order.indexOf(source) > order.indexOf(target) ? 1 : -1;
	}

	function getEndpoint(source: (typeof order)[number], target: (typeof order)[number]) {
		return [source, target].sort(sort).join("");
	}

	const endpoint = getEndpoint(value.source.kind, value.target.kind);

	const url = createUrl({ pathname: `relations/${endpoint}/${value.id}/`, baseUrl });

	log.info(`Fetching relation from ${value.source.label} to ${value.target.label}.`);
	const response = (await request(url, options)) as ApisRelation;

	const relation = createRelation(response, value);
	db.relations.set(relation.id, relation);

	const type = context.getRelationType(relation.type.id);
	const [source, target] = [relation.source.kind, relation.target.kind].sort(sort) as [
		EntityKind,
		EntityKind,
	];
	db.relationTypes.set(type.id, { ...type, source, target });
}

//

async function getRelation(
	source: EntityBase,
	base: ApisRelationBase,
	db: Database,
	context: Context,
): Promise<Relation> {
	const relationBase = createRelationBase(source, base);
	await addRelationById(relationBase, db, context);
	const relation = db.relations.get(relationBase.id);
	assert(relation != null, "Missing relation.");
	return relation;
}

//

async function getPersons(): Promise<Array<Person>> {
	const url = createUrl({
		pathname: "entities/person/",
		baseUrl,
		searchParams: { collection: collectionId, limit },
	});

	log.info("Fetching persons in collection.");
	let response = (await request(url, options)) as ApisPaginatedResponse<ApisPersonBase>;
	const persons = response.results.map(createPerson);
	const pages = Math.ceil(response.count / response.limit);

	while (response.next != null) {
		const page = response.offset / response.limit + 1;
		log.info(`Fetching persons in collection, page ${page + 1} / ${pages}.`);
		response = (await request(
			new URL(response.next),
			options,
		)) as ApisPaginatedResponse<ApisPersonBase>;
		persons.push(...response.results.map(createPerson));
	}

	return persons;
}

//

async function buildRelationTypeHierarchy() {
	log.info("Building relation type hierarchy.");

	const vocabularies = [
		"eventeventrelation",
		"eventworkrelation",
		"institutioneventrelation",
		"institutioninstitutionrelation",
		"institutionplacerelation",
		"institutionworkrelation",
		"personeventrelation",
		"personinstitutionrelation",
		"personpersonrelation",
		"personplacerelation",
		"personworkrelation",
		"placeeventrelation",
		"placeplacerelation",
		"placeworkrelation",
		"workworkrelation",
	];

	const results: Array<RelationType> = [];

	for (const vocabulary of vocabularies) {
		const url = createUrl({
			pathname: `vocabularies/${vocabulary}/`,
			baseUrl,
			/** Assume that no relation type vocabulary has more than 1000 entries. */
			searchParams: { limit: 1000 },
		});

		const response = await request(url, options);
		const _results = response.results as Array<{
			id: number;
			name: string;
			parent_class: { id: number } | null;
		}>;

		results.push(
			..._results.map((result) => {
				return { id: String(result.id), label: result.name, parent_class: result.parent_class };
			}),
		);
	}

	/**
	 * Currently, the person-instition relation types have two roots.
	 * https://ica.acdh-dev.oeaw.ac.at/apis/api/vocabularies/personinstitutionrelation/11397/
	 * should probably be a child of "related".
	 */
	const tree = stratify<RelationType>().parentId((d) => {
		if (d.parent_class === undefined) return undefined;
		if (d.parent_class === null) return "root";
		return String(d.parent_class.id);
	})([{ id: "root", label: "Root" }, ...results]);

	return tree;
}

//

function getTopLevelRelationType(tree: HierarchyNode<RelationType>, id: string) {
	const node = tree.find((d) => {
		return d.id === id;
	});

	assert(node != null, "Unknown relation type.");

	const ancestors = node.ancestors();
	/** Ignore top-level "root" node, and generic "related" ancestor. */
	const type = ancestors.at(-3);

	/** Some relation actually have a generic "related" type. */
	if (type == null) return node.data;

	return type.data;
}

//

async function generate() {
	const db: Database = {
		events: new Map(),
		persons: new Map(),
		professions: new Map(),
		institutions: new Map(),
		places: new Map(),
		relations: new Map(),
		relationTypes: new Map(),
	};

	/**
	 * We want less granular relation types in the UI, so we fetch the hierarchy,
	 * and map relation types to a top-level bucket.
	 */
	const tree = await buildRelationTypeHierarchy();
	const context: Context = {
		getRelationType(id: string) {
			return getTopLevelRelationType(tree, id);
		},
	};

	/** Persons in the `webclient` collection. */
	const persons = await getPersons();
	const ids = new Set(
		persons.map((person) => {
			return String(person.id);
		}),
	);

	for (const person of persons) {
		await addPersonById(person, db, ids, context);
	}

	//

	const outputFolder = path.join(process.cwd(), "src", "db");
	await fs.mkdir(outputFolder, { recursive: true });

	for (const [key, entities] of Object.entries(db)) {
		const filePath = path.join(outputFolder, key + ".ts");
		await fs.writeFile(
			filePath,
			format(`export const ${key} = ${serialize(entities)}`, { ...config, parser: "typescript" }),
			{ encoding: "utf-8" },
		);
	}
}

//

/**
 * Fetch persons from the `webclient` collection, and their relations
 * to places, either direct relations:
 *
 * - person => place
 *
 * or indirect relations:
 *
 * - person => institution => place
 * - person => person => place
 * - person => place => place
 * - person => event => place
 */
generate()
	.then(() => {
		log.success("Successfully generated database.");
	})
	.catch((error) => {
		const message = error instanceof HttpError ? error.response.statusText : String(error);
		log.error("Failed to generate database.\n", message);
	});
