import "maplibre-gl/dist/maplibre-gl.css";

import maplibregl from "maplibre-gl";
import { type ReactNode } from "react";
import { forwardRef } from "react";
import { type MapProps, type MapRef } from "react-map-gl";
import { Map, NavigationControl, ScaleControl, useMap } from "react-map-gl";

import { useElementDimensions } from "@/lib/use-element-dimensions";
import { type ElementRef } from "@/lib/use-element-ref";
import { useElementRef } from "@/lib/use-element-ref";

interface GeoMapProps extends Omit<MapProps, "mapLib"> {
	children?: ReactNode;
}

export const GeoMap = forwardRef<MapRef, GeoMapProps>(function GeoMap(props, ref): JSX.Element {
	const { children } = props;

	const [element, setElement] = useElementRef();

	return (
		<div ref={setElement} className="isolate grid h-full w-full">
			<Map ref={ref} {...props} mapLib={maplibregl}>
				<AutoResize element={element} />
				<NavigationControl position="top-left" />
				<ScaleControl />
				{children}
			</Map>
		</div>
	);
});

interface AutoResizeProps {
	element: ElementRef<Element> | null;
}

function AutoResize(props: AutoResizeProps): null {
	const { element } = props;

	const { current: mapRef } = useMap();
	useElementDimensions({
		element,
		onChange() {
			mapRef?.resize();
		},
	});

	return null;
}
