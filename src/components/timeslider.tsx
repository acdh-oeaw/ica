import 'rsuite/dist/rsuite.min.css'

import { RangeSlider } from 'rsuite'

interface TimeSliderProps {
  onTimeRangeChange: (value: Array<number>) => void
}

export function TimeSlider(props: TimeSliderProps): JSX.Element {
  const { onTimeRangeChange } = props

  return (
    <RangeSlider
      style={{ top: '75%', left: '25%', width: '50%' }}
      min={1920}
      step={5}
      max={1960}
      defaultValue={[1920, 1960]}
      graduated
      onChangeCommitted={onTimeRangeChange}
    />
  )
}
