import cx from "clsx";
import type { ReactNode, RefObject } from "react";
import { useRef } from "react";
import {
	mergeProps,
	useFocusRing,
	useNumberFormatter,
	useSlider,
	useSliderThumb,
	VisuallyHidden,
} from "react-aria";
import type { SliderState } from "react-stately";
import { useSliderState } from "react-stately";

function getYearRange(values: [number, number]): string {
	return values.join(" – ");
}

interface RangeSliderProps {
	getValueLabel?: (values: [number, number]) => string;
	label: ReactNode;
	maxValue: number;
	minValue: number;
	name: string;
	onChange: (value: [number, number]) => void;
	step?: number;
	value: [number, number];
}

export function RangeSlider(props: RangeSliderProps): JSX.Element {
	const { getValueLabel = getYearRange, label, name } = props;

	const trackRef = useRef<HTMLDivElement>(null);
	const numberFormatter = useNumberFormatter();
	const state = useSliderState<[number, number]>({ ...props, numberFormatter });
	const { groupProps, trackProps, labelProps, outputProps } = useSlider(props, state, trackRef);

	return (
		<div {...groupProps} className="grid">
			<div className="flex gap-2 text-xs text-neutral-600">
				<label {...labelProps}>{label}</label>
				<output {...outputProps}>{getValueLabel(state.values as [number, number])}</output>
			</div>
			<div
				ref={trackRef}
				{...trackProps}
				className={cx("relative h-6", state.isDisabled && "pointer-events-none")}
			>
				<div className="absolute inset-x-0 top-1/2 h-0.5 bg-neutral-200" />
				<Thumb
					aria-label="Start"
					index={0}
					name={`${name}-start`}
					state={state}
					trackRef={trackRef}
				/>
				<Thumb aria-label="End" index={1} name={`${name}-end`} state={state} trackRef={trackRef} />
			</div>
		</div>
	);
}

interface ThumbProps {
	"aria-label": string;
	index: number;
	name: string;
	trackRef: RefObject<HTMLDivElement>;
	state: SliderState;
}

function Thumb(props: ThumbProps): JSX.Element {
	const { index, name, state } = props;

	const inputRef = useRef<HTMLInputElement>(null);
	const { thumbProps, inputProps, isDragging } = useSliderThumb({ ...props, inputRef }, state);
	const { focusProps, isFocusVisible } = useFocusRing();

	/**
	 * @see https://github.com/adobe/react-spectrum/issues/3387
	 */
	const zIndex =
		state.getThumbPercent(index === 1 ? 0 : 1) === (index === 1 ? 0 : 1) ? 2 : undefined;

	return (
		<div
			{...thumbProps}
			className={cx(
				"relative top-1/2 h-4 w-4 rounded-full border-2 border-neutral-400 bg-neutral-0",
				isFocusVisible && "border-neutral-500",
				isDragging && "border-neutral-500",
			)}
			style={{ ...thumbProps.style, zIndex }}
		>
			<VisuallyHidden>
				<input ref={inputRef} {...mergeProps(inputProps, focusProps)} name={name} />
			</VisuallyHidden>
		</div>
	);
}
