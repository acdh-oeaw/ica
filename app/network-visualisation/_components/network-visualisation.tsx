"use client";

import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useMemo, useState } from "react";

import { NetworkGraph } from "@/app/network-visualisation/_components/network-graph";
import { useNetworkGraphFilters } from "@/app/network-visualisation/_lib/use-network-graph-filters";
import { EntityDetails } from "@/components/entity-details";
import { FilterControlsPanel } from "@/components/filter-controls-panel";
import { MultiComboBox } from "@/components/multi-combobox";
import { RangeSlider } from "@/components/range-slider";
import { SingleSelect } from "@/components/single-select";
import { db } from "@/db";
import { type Gender, genders } from "@/db/genders";
import type { EntityBase } from "@/db/types";

export function NetworkVisualisation(): ReactNode {
	const t = useTranslations("NetworkVisualisation");

	const filters = useNetworkGraphFilters();

	const formId = "network-visualisation-filter-controls";

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
			labeledGenders.set(id, { id, label: t(`gender.${id}`) });
		});

		return labeledGenders;
	}, [t]);

	const [selectedEntity, setSelectedEntity] = useState<EntityBase | null>(null);

	function onNodeClick(entity: EntityBase | null) {
		setSelectedEntity(entity);
	}

	return (
		<Fragment>
			<NetworkGraph filters={filters} onNodeClick={onNodeClick} />

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
							/**
							 * We only filter person->entity relations in the network graph, so we should only
							 * display corresponding relation types in the combobox.
							 */
							items={personRelationTypes}
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
		</Fragment>
	);
}
