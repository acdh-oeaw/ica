"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useTransition } from "react";
import { Button } from "react-aria-components";

import { MainContent } from "@/components/main-content";
import { useRouter } from "@/lib/i18n/navigation";

interface InternalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/** `React.lazy` requires default export. */
// eslint-disable-next-line import-x/no-default-export
export default function InternalError(props: Readonly<InternalErrorProps>): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("Error");

	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<MainContent className="bg-primary-50">
			<section className="grid place-content-center place-items-center gap-y-8 py-16 xs:py-24">
				<h1 className="text-balance text-center text-2xl font-bold">{t("something-went-wrong")}</h1>
				<Button
					className="inline-flex rounded-md bg-primary-600 px-12 py-4 text-center font-medium text-neutral-0 hover:bg-primary-700 hover:text-neutral-0 focus-visible:bg-primary-700 focus-visible:ring"
					isPending={isPending}
					onPress={() => {
						startTransition(() => {
							router.refresh();
							reset();
						});
					}}
				>
					{t("try-again")}
				</Button>
			</section>
		</MainContent>
	);
}
