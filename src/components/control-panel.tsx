import * as React from 'react'
import { useState } from 'react'

import styles from '@/styles/control-panel.module.css'

const categories = ['places', 'relations']

function ControlPanel(props) {
  const [checked, setChecked] = useState(true)

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
            <label> {name}</label>
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(ControlPanel)
