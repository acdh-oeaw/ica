import { assert } from "@acdh-oeaw/lib";
import type { Feature, FeatureCollection, Point } from "geojson";
import { type ReactNode, useMemo } from "react";
import { type CircleLayer, Layer, Source } from "react-map-gl";

import { db } from "@/db";
import type { Place, Relation } from "@/db/types";
import type { GeoMapFilters } from "@/features/map/use-geo-map-filters";
import { createKey } from "@/lib/create-key";

const colors: Record<Status, string> = {
	selected: "#1b1e28",
	related: "#69c0ef",
};

export const personsLayerStyle: CircleLayer = {
	id: "persons",
	type: "circle",
	paint: {
		"circle-radius": 6,
		/**
		 * For the mapbox-gl expression language @see https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions
		 */
		"circle-color": [
			"case",
			["==", ["get", "status"], "selected"],
			colors.selected,
			colors.related,
		],
	},
};

/**
 * A person can be related to a place indirectly via an intermediary
 * relation, and we potentially want to display this whole path -
 * e.g. person =[worked at]=> institution =[located at]=> place.
 *
 * To deduplicate paths of multiple relations we concatenate their ids to a unique
 * string used as identifier.
 */
type RelationKey = string;

function createRelationEntry(...ids: Array<Relation["id"]>): [RelationKey, Array<Relation["id"]>] {
	return [createKey(...ids), ids];
}

export type PlaceRelationsMap = Map<RelationKey, Array<Relation["id"]>>;

export type SerializablePlaceRelationsMap = Array<[RelationKey, Array<Relation["id"]>]>;

type Status = "related" | "selected";

export type PlaceFeature = Feature<
	Point,
	Pick<Place, "id" | "kind"> & {
		status: Status;
		relations: SerializablePlaceRelationsMap;
	}
>;

interface PersonsLayerProps {
	filters: GeoMapFilters;
}

export function PersonsLayer(props: PersonsLayerProps): ReactNode {
	const { filters } = props;

	const [places, relatedPlaces] = useMemo(() => {
		/**
		 * Places directly related to selected persons.
		 */
		const places = new Map<Place["id"], PlaceRelationsMap>();
		/**
		 * Places indirectly related to selected persons, either via related institutions,
		 * persons, or events:
		 *
		 * - person => institution => place
		 * - person => person => place
		 * - person => event => place
		 */
		const relatedPlaces = new Map<Place["id"], PlaceRelationsMap>();

		let selectedPersons =
			filters.selectedPersons.length === 0
				? Array.from(db.persons.values())
				: filters.selectedPersons.map((personId) => {
						return db.persons.get(personId)!;
					});

		if (filters.selectedProfessions.length > 0) {
			selectedPersons = selectedPersons.filter((person) => {
				return filters.selectedProfessions.some((professionId) => {
					return person.professions.has(professionId);
				});
			});
		}

		if (filters.selectedGender !== "all") {
			selectedPersons = selectedPersons.filter((person) => {
				return person.gender === filters.selectedGender;
			});
		}

		function addPlace(places: Map<Place["id"], PlaceRelationsMap>, id: Place["id"]) {
			if (!places.has(id)) {
				places.set(id, new Map());
			}

			return places.get(id)!;
		}

		/**
		 * Relation type filters are applied to both relations in person => entity => place,
		 * and they match when one of those relations has a matching relation type.
		 */
		function isSelectedRelationType(relation: Relation) {
			if (filters.selectedRelationTypes.length === 0) return true;
			return filters.selectedRelationTypes.includes(relation.type.id);
		}

		const [minYear, maxYear] = filters.selectedDateRange;

		/**
		 * Date range filters are applied to the first relation only, i.e.
		 * to person => entity, but not to the second relation in person => entity => place.
		 */
		function isSelectedDateRange(relation: Relation) {
			// FIXME: clarify behavior, especially for null date fields
			// @see https://github.com/acdh-oeaw/ica/issues/24
			if (relation.startDate != null) {
				const startYear = new Date(relation.startDate).getUTCFullYear();
				if (startYear < minYear) return false;
			}
			if (relation.endDate != null) {
				const endYear = new Date(relation.endDate).getUTCFullYear();
				if (endYear > maxYear) return false;
			}
			return true;
		}

		selectedPersons.forEach((person) => {
			/**
			 * person => place
			 */
			person.places.forEach((relationId) => {
				const relation = db.relations.get(relationId);
				assert(relation != null, "Relation should exist.");
				if (!isSelectedRelationType(relation)) return;
				if (!isSelectedDateRange(relation)) return;

				const target = relation.source.id === person.id ? relation.target : relation.source;
				const place = db.places.get(target.id);
				assert(place != null, "Relation target has unexpected entity kind.");

				addPlace(places, place.id).set(...createRelationEntry(relation.id));
			});

			person.institutions.forEach((relationId) => {
				const relation = db.relations.get(relationId);
				assert(relation != null, "Relation should exist.");
				if (!isSelectedDateRange(relation)) return;

				const target = relation.source.id === person.id ? relation.target : relation.source;
				const _institution = db.institutions.get(target.id);
				assert(_institution != null, "Relation target has unexpected entity kind.");

				/**
				 * person => institution => place
				 */
				_institution.places.forEach((_relationId) => {
					const _relation = db.relations.get(_relationId);
					assert(_relation != null, "Relation should exist.");
					if (!isSelectedRelationType(relation) && !isSelectedRelationType(_relation)) return;

					const target =
						_relation.source.id === _institution.id ? _relation.target : _relation.source;
					const place = db.places.get(target.id);
					assert(place != null, "Relation target has unexpected entity kind.");

					addPlace(relatedPlaces, place.id).set(...createRelationEntry(relation.id, _relation.id));
				});
			});

			person.persons.forEach((relationId) => {
				const relation = db.relations.get(relationId);
				assert(relation != null, "Relation should exist.");
				if (!isSelectedDateRange(relation)) return;

				const target = relation.source.id === person.id ? relation.target : relation.source;
				const _person = db.persons.get(target.id);
				assert(_person != null, "Relation target has unexpected entity kind.");

				/**
				 * person => person => place
				 */
				_person.places.forEach((_relationId) => {
					const _relation = db.relations.get(_relationId);
					assert(_relation != null, "Relation should exist.");
					if (!isSelectedRelationType(relation) && !isSelectedRelationType(_relation)) return;

					const target = _relation.source.id === _person.id ? _relation.target : _relation.source;
					const place = db.places.get(target.id);
					assert(place != null, "Relation target has unexpected entity kind.");

					addPlace(relatedPlaces, place.id).set(...createRelationEntry(relation.id, _relation.id));
				});
			});

			person.events.forEach((relationId) => {
				const relation = db.relations.get(relationId);
				assert(relation != null, "Relation should exist.");
				if (!isSelectedDateRange(relation)) return;

				const target = relation.source.id === person.id ? relation.target : relation.source;
				const _event = db.events.get(target.id);
				assert(_event != null, "Relation target has unexpected entity kind.");

				/**
				 * person => event => place
				 */
				_event.places.forEach((_relationId) => {
					const _relation = db.relations.get(_relationId);
					assert(_relation != null, "Relation should exist.");
					if (!isSelectedRelationType(relation) && !isSelectedRelationType(_relation)) return;

					const target = _relation.source.id === _event.id ? _relation.target : _relation.source;
					const place = db.places.get(target.id);
					assert(place != null, "Relation target has unexpected entity kind.");

					addPlace(relatedPlaces, place.id).set(...createRelationEntry(relation.id, _relation.id));
				});
			});
		});

		return [places, relatedPlaces];
	}, [filters]);

	const geoJson = useMemo(() => {
		const geojson: FeatureCollection = {
			type: "FeatureCollection",
			features: [],
		};

		function createFeature(
			place: Place,
			placeRelations: PlaceRelationsMap,
			status: Status,
		): PlaceFeature {
			return {
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: place.coordinates,
				},
				properties: {
					id: place.id,
					kind: place.kind,
					status,
					/**
					 * Note that `mapbox-gl` json-stringifies any feature properties on events.
					 *
					 * @see https://github.com/mapbox/mapbox-gl-js/issues/2434
					 */
					relations: Array.from(placeRelations),
				},
			};
		}

		places.forEach((content, placeId) => {
			const place = db.places.get(placeId);
			if (place == null) return;

			geojson.features.push(createFeature(place, content, "selected"));
		});

		relatedPlaces.forEach((content, placeId) => {
			if (places.has(placeId)) return;

			const place = db.places.get(placeId);
			if (place == null) return;

			geojson.features.push(createFeature(place, content, "related"));
		});

		return geojson;
	}, [places, relatedPlaces]);

	return (
		<Source type="geojson" data={geoJson}>
			<Layer {...personsLayerStyle} />
		</Source>
	);
}
