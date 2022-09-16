import { useState } from 'react'
import { useMap } from 'react-map-gl'

import { ComboboxMultiple } from '@/components/combobox-multiple'
import { ComboboxSingle } from '@/components/combobox-single'
import { controlPanelStyle } from '@/components/control-panel.config'
import { mapStyle } from '@/components/geo-map.config'
import { ListboxMultiple } from '@/components/listbox-multiple'
import { ModeSwitch } from '@/components/mode-switch'

interface ControlProps {
  filterList: Array<string>
  personList: Array<string>
  relationChange: (type: string, value: Array<string>) => void
  changeMainPerson: (person: string) => void
  setSingleModeMap: (onOff: boolean) => void
}

export function ControlPanel(props: ControlProps): JSX.Element {
  const { setSingleModeMap } = props

  const { current: map } = useMap()

  function toggleBasemap(value: keyof typeof mapStyle) {
    map?.getMap().setStyle(mapStyle[value])
  }

  const [isSinglePersonMode, setSinglePersonMode] = useState(false)

  function setSinglePerson(isSinglePersonMode: boolean) {
    setSinglePersonMode(isSinglePersonMode)
    setSingleModeMap(isSinglePersonMode)
  }

  const [selectedBasemap, setSelectedBasemap] = useState<keyof typeof mapStyle>('positron')

  return (
    <div style={controlPanelStyle.panelStyle}>
      <ModeSwitch isSinglePersonMode={isSinglePersonMode} setSinglePersonMode={setSinglePerson} />
      <h3>Basemaps: </h3>
      {Object.keys(mapStyle).map((basemap) => {
        return (
          <div key={basemap} className="input">
            <input
              type="radio"
              value={basemap}
              checked={selectedBasemap === basemap}
              onChange={(event) => {
                const baseMap = event.target.value as keyof typeof mapStyle
                setSelectedBasemap(baseMap)
                toggleBasemap(baseMap)
              }}
            />
            <label> {basemap}</label>
          </div>
        )
      })}
      {!isSinglePersonMode ? (
        <div>
          <h3>Filters </h3>
          {Object.keys(props.filterList).map((filter) => {
            return (
              <ListboxMultiple
                key={filter}
                // @ts-expect-error Check later
                filterOptions={props.filterList[filter]}
                type={filter}
                relationChange={props.relationChange}
              />
            )
          })}
          <ComboboxMultiple personList={props.personList} relationChange={props.relationChange} />
        </div>
      ) : (
        <ComboboxSingle personList={props.personList} changeMainPerson={props.changeMainPerson} />
      )}
    </div>
  )
}
