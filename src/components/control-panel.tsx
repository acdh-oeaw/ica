import { useState } from 'react'

import styles from '@/styles/control-panel.module.css'

const categories = ['places', 'relations']
const subCategories = {
  places: ['person', 'institution'],
  relations: [
    'Visited regularly',
    'Friends with',
    'Child of',
    'Doctor of',
    'Meeting with',
    'Helped to emigrate',
    'Studied at',
  ],
}
const basemaps = ['positron', 'voyager', 'dark-matter']

interface ControlPanelProps {
  onToggleLayer: (name: string, checked: boolean) => void
  onToggleSubLayer: (subCategory: string, checked: boolean, name: string) => void
  onToggleBasemap: (baseMap: string, value: string) => void
}

export function ControlPanel(props: ControlPanelProps): JSX.Element {
  const [checked, setChecked] = useState(true)
  const [selected, setSelected] = useState('positron')

  return (
    <div className={styles['panel']}>
      <h3>Layers: </h3>
      {categories.map((name) => {
        return (
          <div key={name} className="input">
            <label>
              <input
                type="checkbox"
                defaultChecked={checked}
                onChange={(e) => {
                  setChecked(e.target.checked)
                  return props.onToggleLayer(name, e.target.checked)
                }}
              />
              <b> {name}</b>
            </label>
            {/* @ts-expect-error TODO: fix me later */}
            {subCategories[name].map((subCat) => {
              return (
                <div key={subCat} className="input" style={{ marginLeft: '10px' }}>
                  <label>
                    <input
                    type="checkbox"
                    defaultChecked={checked}
                    onChange={(e) => {
                      setChecked(e.target.checked)
                      props.onToggleSubLayer(subCat, e.target.checked, name)
                    }}
                  />
                  &nbsp;{subCat}</label>
                </div>
              )
            })}
          </div>
        )
      })}
      <h3>Real data:</h3>
        <div className="input">
        <label>  
          <input
            type="checkbox"
            defaultChecked={checked}
            onChange={(e) => {
              setChecked(e.target.checked)
              return props.onToggleLayer('points', e.target.checked)
            }}
          />
          &nbsp;Addresses</label>
        </div>        
      <h3>Basemaps: </h3>
      {basemaps.map((basemap) => {
        return (
          <div key={basemap} className="input">
            <input
              type="radio"
              checked={selected === basemap}
              value={basemap}
              onChange={(e) => {
                setSelected(e.target.value)
                return props.onToggleBasemap(basemap, e.target.value)
              }}
            />
            <label> {basemap}</label>
          </div>
        )
      })}
    </div>
  )
}
