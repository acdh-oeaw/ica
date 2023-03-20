import { events as _events } from "@/db/events";
import { institutions as _institutions } from "@/db/institutions";
import { persons as _persons } from "@/db/persons";
import { places as _places } from "@/db/places";
import { professions as _professions } from "@/db/professions";
import { relations as _relations } from "@/db/relations";
import { relationTypes as _relationTypes } from "@/db/relationTypes";
import type {
	Database,
	Event,
	Institution,
	Person,
	Place,
	ProfessionBase,
	Relation,
	RelationType,
} from "@/db/types";

const events = _events as Map<Event["id"], Event>;
const institutions = _institutions as Map<Institution["id"], Institution>;
const persons = _persons as Map<Person["id"], Person>;
const places = _places as Map<Place["id"], Place>;
const professions = _professions as Map<ProfessionBase["id"], ProfessionBase>;
const relations = _relations as Map<Relation["id"], Relation>;
const relationTypes = _relationTypes as Map<RelationType["id"], RelationType>;

export const db: Database = {
	events,
	institutions,
	persons,
	places,
	professions,
	relations,
	relationTypes,
};
