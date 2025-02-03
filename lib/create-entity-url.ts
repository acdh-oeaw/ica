import { createUrl } from "@acdh-oeaw/lib";

import { entityBaseUrl as baseUrl } from "@/config/api.config";
import type { EntityBase } from "@/db/types";

export function createEntityUrl(entity: EntityBase): string {
	return String(createUrl({ baseUrl, pathname: `${entity.kind}/${entity.id}/detail` }));
}
