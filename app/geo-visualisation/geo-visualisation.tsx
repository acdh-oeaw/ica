"use client";

import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useEffect, useMemo, useState } from "react";
import { type LngLat, type MapLayerMouseEvent, Popup } from "react-map-gl/maplibre";

import { GeoMap } from "@/app/geo-visualisation/_components/geo-map";
import {
	PersonsLayer,
	personsLayerStyle,
	type PlaceFeature,
	type SerializablePlaceRelationsMap,
} from "@/app/geo-visualisation/_components/persons-layer";
import { useGeoMapFilters } from "@/app/geo-visualisation/_lib/use-geo-map-filters";
import { FilterControlsPanel } from "@/components/filter-controls-panel";
import { MultiComboBox } from "@/components/multi-combobox";
import { PopoverContent } from "@/components/popover-content";
import { RangeSlider } from "@/components/range-slider";
import { SingleSelect } from "@/components/single-select";
import { initialViewState, mapStyle } from "@/config/geo-map.config";
import { db } from "@/db";
import { type Gender, genders } from "@/db/genders";
import type { Place } from "@/db/types";

interface Popover {
	place: Place;
	relations: SerializablePlaceRelationsMap;
	coordinates: LngLat;
}

const layerIds = [personsLayerStyle.id];

export function GeoVisualisation(): ReactNode {
	const t = useTranslations("GeoVisualisation");

	const filters = useGeoMapFilters();

	const formId = "geo-visualisation-filter-controls";
	const messages = useMemo(() => {
		return {
			persons: {
				placeholder: t("form.search"),
				nothingFound: t("form.nothing-found"),
				removeSelectedKey(label: string) {
					return t("form.remove-item", { item: label });
				},
			},
			professions: {
				placeholder: t("form.search"),
				nothingFound: t("form.nothing-found"),
				removeSelectedKey(label: string) {
					return t("form.remove-item", { item: label });
				},
			},
			gender: {
				placeholder: t("form.select-option"),
			},
			relationTypes: {
				placeholder: t("form.search"),
				nothingFound: t("form.nothing-found"),
				removeSelectedKey(label: string) {
					return t("form.remove-item", { item: label });
				},
			},
		};
	}, [t]);

	const labeledGenders = useMemo(() => {
		const labeledGenders = new Map<Gender, { id: Gender; label: string }>();

		genders.forEach((id) => {
			labeledGenders.set(id, { id, label: t(`gender.${id}`) });
		});

		return labeledGenders;
	}, [t]);

	const [cursor, setCursor] = useState<"auto" | "pointer">("auto");
	const [popover, setPopover] = useState<Popover | null>(null);

	function onTogglePopover(event: MapLayerMouseEvent) {
		const { features, lngLat } = event;
		const _feature = features?.[0];
		if (_feature == null) {
			setPopover(null);
			return;
		}

		const feature = _feature as unknown as PlaceFeature;
		const { id, relations: stringifiedContent } = feature.properties;

		const place = db.places.get(id)!;

		/**
		 * Note that `mapbox-gl` json-stringifies any feature properties on events.
		 *
		 * @see https://github.com/mapbox/mapbox-gl-js/issues/2434
		 */
		const relations = JSON.parse(
			stringifiedContent as unknown as string,
		) as SerializablePlaceRelationsMap;

		setPopover({ place, relations, coordinates: lngLat });
	}

	function onMouseEnter() {
		setCursor("pointer");
	}

	function onMouseLeave() {
		setCursor("auto");
	}

	/** Avoid popover staying open for a point which is no longer in the selection set. */
	useEffect(() => {
		setPopover(null);
	}, [filters]);

	return (
		<Fragment>
			<GeoMap
				cursor={cursor}
				initialViewState={initialViewState}
				interactiveLayerIds={layerIds}
				mapStyle={mapStyle.positron}
				onClick={onTogglePopover}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<PersonsLayer filters={filters} />
				{popover != null ? (
					<Popup
						closeButton={false}
						closeOnClick={true}
						latitude={popover.coordinates.lat}
						longitude={popover.coordinates.lng}
						onClose={() => {
							setPopover(null);
						}}
					>
						<PopoverContent place={popover.place} relations={popover.relations} />
					</Popup>
				) : null}
			</GeoMap>

			<FilterControlsPanel name={formId}>
				<section className="grid gap-4">
					<h2 className="text-sm font-medium text-neutral-600">Filter persons</h2>

					<div className="grid gap-6" role="group">
						<MultiComboBox
							items={db.persons}
							label={t("filter.person")}
							messages={messages.persons}
							name="persons"
							onSelectionChange={filters.setSelectedPersons}
							selectedKeys={filters.selectedPersons}
						/>
						<MultiComboBox
							items={db.professions}
							label={t("filter.profession")}
							messages={messages.professions}
							name="professions"
							onSelectionChange={filters.setSelectedProfessions}
							selectedKeys={filters.selectedProfessions}
						/>
						<SingleSelect
							items={labeledGenders}
							label={t("filter.gender")}
							messages={messages.gender}
							name="gender"
							onSelectionChange={filters.setSelectedGender}
							selectedKey={filters.selectedGender}
						/>
					</div>
				</section>

				<hr />

				<section className="grid gap-4">
					<h2 className="text-sm font-medium text-neutral-600">Filter relations</h2>
					<div className="grid gap-6">
						<MultiComboBox
							items={db.relationTypes}
							label={t("filter.relation-type")}
							messages={messages.relationTypes}
							name="relation-types"
							onSelectionChange={filters.setSelectedRelationTypes}
							selectedKeys={filters.selectedRelationTypes}
						/>
						<RangeSlider
							label={t("filter.date-range")}
							maxValue={2000}
							minValue={1900}
							name="date-range"
							onChange={filters.setSelectedDateRange}
							value={filters.selectedDateRange}
						/>
					</div>
				</section>
			</FilterControlsPanel>
		</Fragment>
	);
}
