import { useObjectRef } from "@react-aria/utils";
import { forwardRef, type HTMLAttributes, type RefObject } from "react";
import { useOverlayPosition } from "react-aria";
import { createPortal } from "react-dom";

interface SelectPopoverProps extends HTMLAttributes<HTMLDivElement> {
	targetRef: RefObject<HTMLElement | null>;
}

/** Keep filter menus outside panel clipping and within the available viewport space. */
export const SelectPopover = forwardRef<HTMLDivElement, SelectPopoverProps>(function SelectPopover(
	{ targetRef, style, ...props },
	forwardedRef,
) {
	const ref = useObjectRef(forwardedRef);
	const { overlayProps } = useOverlayPosition({
		targetRef,
		overlayRef: ref,
		placement: "bottom start",
		offset: 4,
		containerPadding: 8,
		maxHeight: 384,
	});

	return createPortal(
		<div
			{...props}
			{...overlayProps}
			ref={ref}
			style={{
				...style,
				...overlayProps.style,
				width: targetRef.current?.getBoundingClientRect().width,
			}}
		/>,
		document.body,
	);
});
