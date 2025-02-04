import { createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import type { EntityBase } from "@/db/types";

export function createEntityUrl(entity: EntityBase): string {
	return String(
		createUrl({
			baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
			pathname: `/apis/entities/entity/${entity.kind}/${entity.id}/detail`,
		}),
	);
}
