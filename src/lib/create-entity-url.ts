import { createUrl } from "@stefanprobst/request";

import { type EntityBase } from "@/db/types";
import { entityBaseUrl as baseUrl } from "~/config/api.config";

export function createEntityUrl(entity: EntityBase): string {
	return String(createUrl({ baseUrl, pathname: `${entity.kind}/${entity.id}/detail` }));
}
