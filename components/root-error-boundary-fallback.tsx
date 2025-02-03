import { useError } from "@stefanprobst/next-error-boundary";
import { useRouter } from "next/router";
import { type ReactNode, useEffect } from "react";

export function RootErrorBoundaryFallback(): ReactNode {
	const router = useRouter();
	const { onReset } = useError();

	useEffect(() => {
		router.events.on("routeChangeComplete", onReset);

		return () => {
			router.events.off("routeChangeComplete", onReset);
		};
	}, [router.events, onReset]);

	return <p>Something went horribly wrong!</p>;
}
