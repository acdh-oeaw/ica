import { noop } from "@acdh-oeaw/lib";
import { useEffect, useState } from "react";

import type { ElementRef } from "@/lib/use-element-ref";
import { useEvent } from "@/lib/use-event";

// TODO: avoid destroying and recreating observer when element changes
// TODO: options

interface UseResizeObserverParams {
	element: ElementRef<Element> | null;
	onChange?: (entry: ResizeObserverEntry) => void;
	// options?: ResizeObserverOptions;
}

export function useResizeObserver(params: UseResizeObserverParams): ResizeObserverEntry | null {
	const { element, onChange = noop } = params;

	const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);
	const callback = useEvent(onChange);

	useEffect(() => {
		if (element == null) return;

		const observer = new ResizeObserver((entries) => {
			const [entry] = entries;

			if (!entry) return;

			callback(entry);
			setEntry(entry);
		});

		observer.observe(element);

		return () => {
			observer.unobserve(element);
			observer.disconnect();
		};
	}, [callback, element]);

	return entry;
}
