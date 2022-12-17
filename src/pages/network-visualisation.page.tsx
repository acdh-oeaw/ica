import { PageMetadata } from '@stefanprobst/next-page-metadata'
import { Fragment, useMemo } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { FilterControlsPanel } from '@/components/filter-controls-panel'
import { MainContent } from '@/components/main-content'
import { MultiComboBox } from '@/components/multi-combobox'
import { RangeSlider } from '@/components/range-slider'
import { db } from '@/db'
import { NetworkGraph } from '@/features/network-visualisation/network-graph'
import { useNetworkGraphFilters } from '@/features/network-visualisation/use-network-graph-filters'

export const getStaticProps = withDictionaries(['common'])

export default function GeoVisualisationPage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()
  const filters = useNetworkGraphFilters()

  const metadata = { title: t(['common', 'pages', 'network-visualisation', 'metadata', 'title']) }

  const formId = 'network-visualisation-filter-controls'
  const messages = useMemo(() => {
    return {
      persons: {
        placeholder: t(['common', 'form', 'search']),
        nothingFound: t(['common', 'form', 'nothing-found']),
        removeSelectedKey(label: string) {
          return t(['common', 'form', 'remove-item'], { values: { item: label } })
        },
      },
      professions: {
        placeholder: t(['common', 'form', 'search']),
        nothingFound: t(['common', 'form', 'nothing-found']),
        removeSelectedKey(label: string) {
          return t(['common', 'form', 'remove-item'], { values: { item: label } })
        },
      },
      relationTypes: {
        placeholder: t(['common', 'form', 'search']),
        nothingFound: t(['common', 'form', 'nothing-found']),
        removeSelectedKey(label: string) {
          return t(['common', 'form', 'remove-item'], { values: { item: label } })
        },
      },
    }
  }, [t])

  const personRelationTypes = useMemo(() => {
    const relationTypes = new Map() as typeof db.relationTypes

    db.relationTypes.forEach((value, key) => {
      if (value.source === 'person' || value.target === 'person') {
        relationTypes.set(key, value)
      }
    })

    return relationTypes
  }, [])

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <MainContent className="relative grid grid-cols-[1fr_384px]">
        <NetworkGraph filters={filters} />
        <FilterControlsPanel name={formId}>
          <section className="grid gap-4">
            <h2 className="text-sm font-medium text-neutral-600">Filter persons</h2>
            <div className="grid gap-6" role="group">
              <MultiComboBox
                items={db.persons}
                messages={messages.persons}
                name="persons"
                label="Persons"
                onSelectionChange={filters.setSelectedPersons}
                selectedKeys={filters.selectedPersons}
              />
              <MultiComboBox
                items={db.professions}
                messages={messages.professions}
                name="professions"
                label="Professions"
                onSelectionChange={filters.setSelectedProfessions}
                selectedKeys={filters.selectedProfessions}
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
                messages={messages.relationTypes}
                name="relation-types"
                label="Relation types"
                onSelectionChange={filters.setSelectedRelationTypes}
                selectedKeys={filters.selectedRelationTypes}
              />
              <RangeSlider
                label="Date range"
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
  )
}
