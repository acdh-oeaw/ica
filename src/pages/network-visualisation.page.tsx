import { PageMetadata } from "@stefanprobst/next-page-metadata";
import { Fragment, useMemo, useState } from "react";

import { EntityDetails } from "@/components/entity-details";
import { FilterControlsPanel } from "@/components/filter-controls-panel";
import { MainContent } from "@/components/main-content";
import { MultiComboBox } from "@/components/multi-combobox";
import { RangeSlider } from "@/components/range-slider";
import { SingleSelect } from "@/components/single-select";
import { db } from "@/db";
import { type Gender, genders } from "@/db/genders";
import { type EntityBase } from "@/db/types";
import { NetworkGraph } from "@/features/network-visualisation/network-graph";
import { useNetworkGraphFilters } from "@/features/network-visualisation/use-network-graph-filters";
import { useI18n } from "@/lib/i18n/use-i18n";
import { withDictionaries } from "@/lib/i18n/with-dictionaries";
import { usePageTitleTemplate } from "@/lib/metadata/use-page-title-template";

export const getStaticProps = withDictionaries(["common"]);

export default function GeoVisualisationPage(): JSX.Element {
	const { t } = useI18n<"common">();
	const titleTemplate = usePageTitleTemplate();
	const filters = useNetworkGraphFilters();

	const metadata = { title: t(["common", "pages", "network-visualisation", "metadata", "title"]) };

	const formId = "network-visualisation-filter-controls";
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

	const personRelationTypes = useMemo(() => {
		const relationTypes = new Map() as typeof db.relationTypes;

		db.relationTypes.forEach((value, key) => {
			if (value.source === "person" || value.target === "person") {
				relationTypes.set(key, value);
			}
		});

		return relationTypes;
	}, []);

	const labeledGenders = useMemo(() => {
		const labeledGenders = new Map<Gender, { id: Gender; label: string }>();

		genders.forEach((id) => {
			labeledGenders.set(id, { id, label: t(["common", "gender", id]) });
		});

		return labeledGenders;
	}, [t]);

	const [selectedEntity, setSelectedEntity] = useState<EntityBase | null>(null);

	function onNodeClick(entity: EntityBase | null) {
		setSelectedEntity(entity);
	}

	return (
		<Fragment>
			<PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
			<MainContent className="relative grid grid-cols-[1fr_384px]">
				<NetworkGraph filters={filters} onNodeClick={onNodeClick} />
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
								/**
								 * We only filter person->entity relations in the network graph, so we should only
								 * display corresponding relation types in the combobox.
								 */
								items={personRelationTypes}
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
					{selectedEntity != null ? (
						<>
							<hr />
							<section className="relative grid flex-1 gap-4">
								<div className="absolute inset-0 overflow-auto">
									<EntityDetails entity={selectedEntity} />
								</div>
							</section>
						</>
					) : null}
				</FilterControlsPanel>
			</MainContent>
		</Fragment>
	);
}
