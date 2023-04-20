import { PageMetadata } from "@stefanprobst/next-page-metadata";
import { Fragment, useEffect, useMemo, useState } from "react";
import { type LngLat, type MapLayerMouseEvent } from "react-map-gl";
import { Popup } from "react-map-gl";

import { FilterControlsPanel } from "@/components/filter-controls-panel";
import { MainContent } from "@/components/main-content";
import { MultiComboBox } from "@/components/multi-combobox";
import { PopoverContent } from "@/components/popover-content";
import { RangeSlider } from "@/components/range-slider";
import { SingleSelect } from "@/components/single-select";
import { db } from "@/db";
import { type Gender, genders } from "@/db/genders";
import { type Place } from "@/db/types";
import { GeoMap } from "@/features/map/geo-map";
import { initialViewState, mapStyle } from "@/features/map/geo-map.config";
import {
	type PlaceFeature,
	type SerializablePlaceRelationsMap,
} from "@/features/map/persons-layer";
import { PersonsLayer, personsLayerStyle } from "@/features/map/persons-layer";
import { useGeoMapFilters } from "@/features/map/use-geo-map-filters";
import { useI18n } from "@/lib/i18n/use-i18n";
import { withDictionaries } from "@/lib/i18n/with-dictionaries";
import { usePageTitleTemplate } from "@/lib/metadata/use-page-title-template";

export const getStaticProps = withDictionaries(["common"]);

interface Popover {
	place: Place;
	relations: SerializablePlaceRelationsMap;
	coordinates: LngLat;
}

const layerIds = [personsLayerStyle.id];

export default function GeoVisualisationPage(): JSX.Element {
	const { t } = useI18n<"common">();
	const titleTemplate = usePageTitleTemplate();
	const filters = useGeoMapFilters();

	const metadata = { title: t(["common", "pages", "geo-visualisation", "metadata", "title"]) };

	const formId = "geo-visualisation-filter-controls";
	const messages = useMemo(() => {
		return {
			persons: {
				placeholder: t(["common", "form", "search"]),
				nothingFound: t(["common", "form", "nothing-found"]),
				removeSelectedKey(label: string) {
					return t(["common", "form", "remove-item"], { values: { item: label } });
				},
			},
			professions: {
				placeholder: t(["common", "form", "search"]),
				nothingFound: t(["common", "form", "nothing-found"]),
				removeSelectedKey(label: string) {
					return t(["common", "form", "remove-item"], { values: { item: label } });
				},
			},
			gender: {
				placeholder: t(["common", "form", "select-option"]),
			},
			relationTypes: {
				placeholder: t(["common", "form", "search"]),
				nothingFound: t(["common", "form", "nothing-found"]),
				removeSelectedKey(label: string) {
					return t(["common", "form", "remove-item"], { values: { item: label } });
				},
			},
		};
	}, [t]);

	const labeledGenders = useMemo(() => {
		const labeledGenders = new Map<Gender, { id: Gender; label: string }>();

		genders.forEach((id) => {
			labeledGenders.set(id, { id, label: t(["common", "gender", id]) });
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

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
			<PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
			<MainContent className="relative grid grid-cols-[1fr_384px]">
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
							closeOnClick
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
								label={t(["common", "filter", "person"])}
								messages={messages.persons}
								name="persons"
								onSelectionChange={filters.setSelectedPersons}
								selectedKeys={filters.selectedPersons}
							/>
							<MultiComboBox
								items={db.professions}
								label={t(["common", "filter", "profession"])}
								messages={messages.professions}
								name="professions"
								onSelectionChange={filters.setSelectedProfessions}
								selectedKeys={filters.selectedProfessions}
							/>
							<SingleSelect
								items={labeledGenders}
								label={t(["common", "filter", "gender"])}
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
								label={t(["common", "filter", "relation-type"])}
								messages={messages.relationTypes}
								name="relation-types"
								onSelectionChange={filters.setSelectedRelationTypes}
								selectedKeys={filters.selectedRelationTypes}
							/>
							<RangeSlider
								label={t(["common", "filter", "date-range"])}
								minValue={1900}
								maxValue={2000}
								name="date-range"
								onChange={filters.setSelectedDateRange}
								value={filters.selectedDateRange}
							/>
						</div>
					</section>
				</FilterControlsPanel>
			</MainContent>
		</Fragment>
	);
}
