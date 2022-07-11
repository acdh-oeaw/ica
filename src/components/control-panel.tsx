import * as React from 'react'
import { useState } from 'react'

import styles from '@/styles/control-panel.module.css'

const categories = ['places', 'relations'];
const subCategories = {
  'places': ['person', 'institution'],
  'relations': ['Visited regularly', 'Friends with', 'Child of', 'Doctor of', 'Meeting with', 'Helped to emigrate', 'Studied at']
};
const basemaps = ['positron','voyager','dark-matter'];


function ControlPanel(props) {
  const [checked, setChecked] = useState(true)
  const [selected, setSelected] = useState('positron');

  return (
    <div className={styles.panel}>
      <h3>Layers: </h3>
      {categories.map((name) => {
        return (
          <div key={name} className="input">
            <input
              type="checkbox"
              checked={checked[name]}
              defaultChecked={checked}
              onChange={(e) => {
                setChecked(e.target.checked)
                return props.onToggleLayer(name, e.target.checked)
              }}
            />
            <label><b> {name}</b></label>
            {subCategories[name].map((subCat) => {
              return (
                <div key={subCat} className="input" style={{marginLeft: '10px'}}>
                  <input
                    type="checkbox"
                    checked={checked[subCat]}
                    defaultChecked={checked}
                    onChange={(e) => {
                      setChecked(e.target.checked)
                      return props.onToggleSubLayer(subCat, e.target.checked, name)
                    }}
                  />
                  <label> {subCat}</label>
                </div>
              )
            })}
          </div>
        )
      })}
      <h3>Basemaps: </h3>
      {basemaps.map((basemap) => {
        return (
          <div key={basemap} className="input">
            <input
              type="radio"
              checked={selected === basemap}
              value={basemap}
              onChange={(e) => {
                setSelected(e.target.value);
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

export default React.memo(ControlPanel)
