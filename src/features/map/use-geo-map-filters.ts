import { type Dispatch, type SetStateAction } from "react";
import { useMemo, useState } from "react";

import { type Gender } from "@/db/genders";
import {
	type Person,
	type Place,
	type ProfessionBase as Profession,
	type RelationType,
} from "@/db/types";

export interface GeoMapFilters {
	selectedPersons: Array<Person["id"]>;
	setSelectedPersons: Dispatch<SetStateAction<Array<Person["id"]>>>;
	selectedProfessions: Array<Profession["id"]>;
	setSelectedProfessions: Dispatch<SetStateAction<Array<Profession["id"]>>>;
	selectedGender: Gender;
	setSelectedGender: Dispatch<SetStateAction<Gender>>;
	selectedRelationTypes: Array<RelationType["id"]>;
	setSelectedRelationTypes: Dispatch<SetStateAction<Array<RelationType["id"]>>>;
	selectedDateRange: [number, number];
	setSelectedDateRange: Dispatch<SetStateAction<[number, number]>>;
}

export function useGeoMapFilters(): GeoMapFilters {
	const [selectedPersons, setSelectedPersons] = useState<Array<Person["id"]>>([]);
	const [selectedProfessions, setSelectedProfessions] = useState<Array<Place["id"]>>([]);
	const [selectedGender, setSelectedGender] = useState<Gender>("all");
	const [selectedRelationTypes, setSelectedRelationTypes] = useState<Array<RelationType["id"]>>([]);
	const [selectedDateRange, setSelectedDateRange] = useState<[number, number]>([1900, 2000]);

	const filters: GeoMapFilters = useMemo(() => {
		/**
		 * Filtering by person name, and filtering by profession is mutually exclusive.
		 */
		function _setSelectedPersons(...args: Parameters<typeof setSelectedPersons>) {
			setSelectedPersons(...args);
			setSelectedProfessions([]);
		}
		function _setSelectedProfessions(...args: Parameters<typeof setSelectedProfessions>) {
			setSelectedProfessions(...args);
			setSelectedPersons([]);
		}

		return {
			selectedPersons,
			setSelectedPersons: _setSelectedPersons,
			selectedProfessions,
			setSelectedProfessions: _setSelectedProfessions,
			selectedGender,
			setSelectedGender,
			selectedRelationTypes,
			setSelectedRelationTypes,
			selectedDateRange,
			setSelectedDateRange,
		};
	}, [
		selectedPersons,
		setSelectedPersons,
		selectedProfessions,
		setSelectedProfessions,
		selectedGender,
		setSelectedGender,
		selectedRelationTypes,
		setSelectedRelationTypes,
		selectedDateRange,
		setSelectedDateRange,
	]);

	return filters;
}
