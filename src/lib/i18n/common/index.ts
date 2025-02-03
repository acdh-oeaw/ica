import type { Gender } from "@/db/genders";
import type { EntityKind } from "@/db/types";
import type { Plurals as _Plurals, Plurals } from "@/lib/i18n/dictionaries";
import type { Locale } from "~/config/i18n.config";

type HtmlString = string;

export interface Dictionary {
	app: {
		"change-language-to": string;
		"toggle-color-scheme": string;
	};
	language: Record<Locale, string>;
	page: {
		"skip-to-main-content": string;
	};
	pages: {
		"404": {
			metadata: {
				title: string;
			};
		};
		"500": {
			metadata: {
				title: string;
			};
		};
		home: {
			metadata: {
				title: string;
			};
		};
		imprint: {
			metadata: {
				title: string;
			};
		};
		"geo-visualisation": {
			metadata: {
				title: string;
			};
		};
		"network-visualisation": {
			metadata: {
				title: string;
			};
		};
	};
	home: {
		"explore-graph": string;
		"explore-map": string;
		intro: HtmlString;
	};
	form: {
		"nothing-found": string;
		"remove-item": string;
		search: string;
		"select-option": string;
	};
	filter: {
		person: string;
		profession: string;
		gender: string;
		"relation-type": string;
		"date-range": string;
	};
	entity: Record<EntityKind, Plurals>;
	gender: Record<Gender, string>;
	"see-database-entry": string;
	"see-database-entry-for": string;
	details: {
		professions: string;
		notes: string;
		references: string;
		"related-persons": string;
		"related-places": string;
		"related-institutions": string;
		"related-events": string;
	};
}
