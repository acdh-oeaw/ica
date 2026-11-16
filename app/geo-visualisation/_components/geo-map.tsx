import "maplibre-gl/dist/maplibre-gl.css";

import { GPUInitializationError, setWorkerUrl } from "maplibre-gl";
import { useTranslations } from "next-intl";
import { forwardRef, type ReactNode, useState } from "react";
import {
	Map,
	type MapProps,
	type MapRef,
	NavigationControl,
	ScaleControl,
	useMap,
} from "react-map-gl/maplibre";

import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";
import { useElementDimensions } from "@/lib/use-element-dimensions";
import { type ElementRef, useElementRef } from "@/lib/use-element-ref";

// A static URL lets Turbopack emit MapLibre's worker as a separate asset.
setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);

type MapErrorEvent = Parameters<NonNullable<MapProps["onError"]>>[0];

interface GeoMapProps extends Omit<MapProps, "mapLib"> {
	children?: ReactNode;
}

export const GeoMap = forwardRef<MapRef, GeoMapProps>(function GeoMap(props, ref): ReactNode {
	const { children, onError, ...mapProps } = props;
	const t = useTranslations("GeoMap");
	const [hasGraphicsError, setHasGraphicsError] = useState(false);

	const [element, setElement] = useElementRef();

	function onMapError(event: MapErrorEvent): void {
		const isGraphicsError = event.error instanceof GPUInitializationError;
		if (isGraphicsError) setHasGraphicsError(true);

		if (onError != null) {
			onError(event);
		} else if (!isGraphicsError) {
			console.error(event.error);
		}
	}

	return (
		<div ref={setElement} className="isolate grid size-full">
			{hasGraphicsError ? (
				<div
					className="mx-auto grid max-w-md content-center justify-items-center gap-4 p-8 text-center text-sm leading-relaxed text-neutral-600"
					role="status"
				>
					<h2 className="text-lg font-medium text-neutral-900">{t("unavailable-title")}</h2>
					<p>{t("unavailable-description")}</p>
					<Link
						className="underline decoration-dotted underline-offset-4 hover:text-neutral-900"
						href={createHref({ pathname: "/network-visualisation" })}
					>
						{t("explore-network")}
					</Link>
				</div>
			) : (
				<Map ref={ref} {...mapProps} onError={onMapError}>
					<AutoResize element={element} />
					<NavigationControl position="top-left" />
					<ScaleControl />
					{children}
				</Map>
			)}
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
