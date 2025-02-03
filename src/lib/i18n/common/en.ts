import type { Dictionary } from "@/lib/i18n/common";

export const dictionary: Dictionary = {
	app: {
		"change-language-to": "Change language to {{language}}",
		"toggle-color-scheme": "Toggle color scheme",
	},
	language: {
		en: "English",
	},
	page: {
		"skip-to-main-content": "Skip to main content",
	},
	pages: {
		"404": {
			metadata: {
				title: "Page not found",
			},
		},
		"500": {
			metadata: {
				title: "Unexpected error",
			},
		},
		home: {
			metadata: {
				title: "Home",
			},
		},
		imprint: {
			metadata: {
				title: "Imprint",
			},
		},
		"geo-visualisation": {
			metadata: {
				title: "Geo-Visualisation",
			},
		},
		"network-visualisation": {
			metadata: {
				title: "Network-Visualisation",
			},
		},
	},
	home: {
		"explore-graph": "Explore Graph",
		"explore-map": "Explore Map",
		intro: `
    <p>
      During the last ten years the members of the interdisciplinary North Atlantic
      Triangle commission have explored the close transatlantic links between
      Europeans and North Americans and the exchange of people and ideas in the
      19th, 20th and 21st centuries. They have in particular documented the networks
      established especially in the years between the two World Wars, and have
      underlined the importance of these relationships for the refugees from Nazi
      Germany, including Austria after the Anschluss, who sought a safe haven in the
      USA.
    </p>
    <p>
      The database established by the commission shows the ties of friendship
      between many American foreign correspondents simultaneously stationed in
      Vienna and visiting writers as well as numerous physicians attending courses
      arranged by the American Medical Association in Vienna, on the one hand, and
      members of the Austrian social and cultural elite, on the other. The database
      demonstrates the fact that the proximity of their residences in Vienna
      facilitated contacts and interaction, as is visualized with the help of the
      Geographic Information System. Later these networks facilitated the search for
      safety in North America, where the refugees needed affidavits supplied by
      their American friends to find support and employment. This happened
      especially close to the Atlantic and the Pacific coasts and particularly in
      some academic fields, and in the realms of music and the theater.
    </p>
    <p>
      Search in the database will permit interested users to identify key agents in
      the transatlantic cultural exchange, especially between the 1920s and 1960s,
      and to trace their careers. It will allow users to recognize the role of
      encounters for scores of individuals in Central Europe and in the USA and
      Canada, whose autobiographies and correspondence reflect these ties. It will
      also enable users to assess the impact of transatlantic interaction on the
      genesis of non-fictional and fictional texts, on plays and musical
      compositions, and on the evolution of (shared) philosophical and political
      ideas. It will also help to identify the consequences of these exchanges for
      the perception of the societies on the other side of the Atlantic, and for the
      development of various institutions. The database will also illustrate the
      fortunes and activities of the (relatively few) returnees among the emigrants,
      and show the effect and significance of the exchanges across the North
      Atlantic, all so far documented in the ten volumes published by the commission
      since 2012.The database will aid the users in their attempts to comprehend the
      historical shifts in the relationship between the countries of Europe and
      North America.
    </p>`,
	},
	form: {
		"nothing-found": "Nothing found",
		"remove-item": "Remove {{item}}",
		search: "Search...",
		"select-option": "Please select an option",
	},
	filter: {
		person: "Persons",
		profession: "Professions",
		gender: "Gender",
		"relation-type": "Relation types",
		"date-range": "Date range",
	},
	entity: {
		event: { one: "Event", other: "Events " },
		institution: { one: "Institution", other: "Institutions " },
		person: { one: "Person", other: "Persons " },
		place: { one: "Place", other: "Places " },
		work: { one: "Work", other: "Works " },
	},
	gender: {
		all: "All genders",
		female: "Female",
		male: "Male",
	},
	"see-database-entry": "See database entry",
	"see-database-entry-for": "See database entry for {{label}}",
	details: {
		professions: "Professions",
		notes: "Notes",
		references: "References",
		"related-persons": "Related persons",
		"related-places": "Related places",
		"related-institutions": "Related institutions",
		"related-events": "Related events",
	},
};
