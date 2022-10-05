import cx from 'clsx'
import type { RefObject } from 'react'
import { useRef } from 'react'
import {
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from 'react-aria'
import type { SliderState } from 'react-stately'
import { useSliderState } from 'react-stately'

interface RangeSliderProps {
  defaultValue?: [number, number]
  label: string
  maxValue: number
  minValue: number
  step: number
}

export function RangeSlider(props: RangeSliderProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null)
  const numberFormatter = useNumberFormatter()
  const state = useSliderState({ ...props, numberFormatter })
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(props, state, trackRef)

  return (
    <div {...groupProps} className="grid">
      {props.label && (
        <div className="flex gap-2 text-xs text-neutral-600">
          <label {...labelProps}>{props.label}</label>
          <output {...outputProps}>
            {`${state.getThumbValueLabel(0)} - ${state.getThumbValueLabel(1)}`}
          </output>
        </div>
      )}
      <div
        ref={trackRef}
        {...trackProps}
        className={cx('h-6', state.isDisabled && 'pointer-events-none')}
      >
        <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-500" />
        <Thumb index={0} state={state} trackRef={trackRef} />
        <Thumb index={1} state={state} trackRef={trackRef} />
      </div>
    </div>
  )
}

interface ThumbProps {
  index: number
  trackRef: RefObject<HTMLDivElement>
  state: SliderState
}

function Thumb(props: ThumbProps): JSX.Element {
  const { index, state, trackRef } = props

  const inputRef = useRef(null)
  const { thumbProps, inputProps, isDragging } = useSliderThumb(
    { index, trackRef, inputRef },
    state,
  )
  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <div
      {...thumbProps}
      className={cx(
        'top-1/2 h-4 w-4 rounded-full border border-neutral-500 bg-neutral-0',
        isFocusVisible && '',
        isDragging && 'dragging',
      )}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  )
}
