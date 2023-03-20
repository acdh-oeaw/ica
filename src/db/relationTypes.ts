export const relationTypes = new Map([
	[
		"10851",
		{
			id: "10851",
			label: "participated in",
			parent_class: {
				id: 6358,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6358\u002F",
				parent_id: null,
			},
			source: "person",
			target: "event",
		},
	],
	[
		"10441",
		{
			id: "10441",
			label: "studied at",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"11381",
		{
			id: "11381",
			label: "location",
			parent_class: {
				id: 6361,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6361\u002F",
				parent_id: null,
			},
			source: "institution",
			target: "place",
		},
	],
	[
		"10444",
		{
			id: "10444",
			label: "located in",
			parent_class: {
				id: 6364,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6364\u002F",
				parent_id: null,
			},
			source: "place",
			target: "place",
		},
	],
	[
		"10446",
		{
			id: "10446",
			label: "renamed into",
			parent_class: {
				id: 6364,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6364\u002F",
				parent_id: null,
			},
			source: "place",
			target: "place",
		},
	],
	[
		"6357",
		{ id: "6357", label: "related", parent_class: null, source: "person", target: "institution" },
	],
	[
		"10544",
		{
			id: "10544",
			label: "visited",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10469",
		{
			id: "10469",
			label: "worked for\u002Fat",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10471",
		{
			id: "10471",
			label: "friendship with",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10656",
		{
			id: "10656",
			label: "held",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10520",
		{
			id: "10520",
			label: "attended",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10542",
		{
			id: "10542",
			label: "founder of",
			parent_class: {
				id: 11397,
				label: "established",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F11397\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10992",
		{
			id: "10992",
			label: "was head of",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10498",
		{
			id: "10498",
			label: "acquainted with",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10612",
		{
			id: "10612",
			label: "was location for",
			parent_class: {
				id: 6365,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6365\u002F",
				parent_id: null,
			},
			source: "place",
			target: "event",
		},
	],
	[
		"10699",
		{
			id: "10699",
			label: "witnessed",
			parent_class: {
				id: 6358,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6358\u002F",
				parent_id: null,
			},
			source: "person",
			target: "event",
		},
	],
	[
		"10595",
		{
			id: "10595",
			label: "wrote for",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10686",
		{
			id: "10686",
			label: "in a relationship with",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10514",
		{
			id: "10514",
			label: "child-in-law of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10905",
		{
			id: "10905",
			label: "contributed artistically to",
			parent_class: {
				id: 6358,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6358\u002F",
				parent_id: null,
			},
			source: "person",
			target: "event",
		},
	],
	[
		"11025",
		{
			id: "11025",
			label: "is location for",
			parent_class: {
				id: 6365,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6365\u002F",
				parent_id: null,
			},
			source: "place",
			target: "event",
		},
	],
	[
		"11176",
		{
			id: "11176",
			label: "received benefits from",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"11178",
		{
			id: "11178",
			label: "meetings often took place at",
			parent_class: {
				id: 6361,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6361\u002F",
				parent_id: null,
			},
			source: "institution",
			target: "place",
		},
	],
	[
		"10524",
		{
			id: "10524",
			label: "visited",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10500",
		{
			id: "10500",
			label: "collaborated with",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10653",
		{
			id: "10653",
			label: "owner of",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10888",
		{
			id: "10888",
			label: "qualified as a docent (habilitation) at",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10614",
		{
			id: "10614",
			label: "translator of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10626",
		{
			id: "10626",
			label: "helped to emigrate",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"11263",
		{
			id: "11263",
			label: "supported",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10690",
		{
			id: "10690",
			label: "won",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"4",
		{
			id: "4",
			label: "born in",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"5",
		{
			id: "5",
			label: "died in",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10529",
		{
			id: "10529",
			label: "lived at",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10627",
		{
			id: "10627",
			label: "emigrated to",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10464",
		{
			id: "10464",
			label: "stayed in",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10892",
		{
			id: "10892",
			label: "editor of",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10758",
		{
			id: "10758",
			label: "was member of",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10804",
		{
			id: "10804",
			label: "co-founder of",
			parent_class: {
				id: 11397,
				label: "established",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F11397\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"11324",
		{
			id: "11324",
			label: "taught at",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"11064",
		{
			id: "11064",
			label: "founding member of",
			parent_class: {
				id: 11397,
				label: "established",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F11397\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10474",
		{ id: "10474", label: "Place of Birth", parent_class: null, source: "person", target: "place" },
	],
	[
		"10650",
		{
			id: "10650",
			label: "lived in",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10960",
		{
			id: "10960",
			label: "moved to",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	["6364", { id: "6364", label: "related", parent_class: null, source: "place", target: "place" }],
	[
		"10590",
		{
			id: "10590",
			label: "rented",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"11040",
		{
			id: "11040",
			label: "admirer of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10970",
		{
			id: "10970",
			label: "helped",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"11396",
		{
			id: "11396",
			label: "related to",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10584",
		{
			id: "10584",
			label: "owner of",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"11186",
		{
			id: "11186",
			label: "financially supported",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10918",
		{
			id: "10918",
			label: "was commemorated by",
			parent_class: {
				id: 6358,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6358\u002F",
				parent_id: null,
			},
			source: "person",
			target: "event",
		},
	],
	[
		"10571",
		{
			id: "10571",
			label: "student of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"11213",
		{
			id: "11213",
			label: "located in",
			parent_class: {
				id: 6361,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6361\u002F",
				parent_id: null,
			},
			source: "institution",
			target: "place",
		},
	],
	[
		"11163",
		{
			id: "11163",
			label: "met",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"11167",
		{
			id: "11167",
			label: "had named after him\u002Fherself",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10769",
		{
			id: "10769",
			label: "expelled from",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10660",
		{
			id: "10660",
			label: "fled to",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	["6356", { id: "6356", label: "related", parent_class: null, source: "person", target: "place" }],
	[
		"10581",
		{
			id: "10581",
			label: "patient of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10914",
		{
			id: "10914",
			label: "rented",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"6355",
		{ id: "6355", label: "related", parent_class: null, source: "person", target: "person" },
	],
	[
		"10988",
		{
			id: "10988",
			label: "interviewed",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10600",
		{
			id: "10600",
			label: "landlady\u002Flandlord of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10763",
		{
			id: "10763",
			label: "employed by",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10664",
		{
			id: "10664",
			label: "qualified as a professor at",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10941",
		{
			id: "10941",
			label: "got the venia legendi at",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10945",
		{
			id: "10945",
			label: "converted to",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10673",
		{
			id: "10673",
			label: "returned to",
			parent_class: {
				id: 6356,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6356\u002F",
				parent_id: null,
			},
			source: "person",
			target: "place",
		},
	],
	[
		"10591",
		{
			id: "10591",
			label: "publisher of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10839",
		{
			id: "10839",
			label: "advisor of",
			parent_class: {
				id: 6355,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6355\u002F",
				parent_id: null,
			},
			source: "person",
			target: "person",
		},
	],
	[
		"10876",
		{
			id: "10876",
			label: "was a stop during",
			parent_class: {
				id: 6365,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6365\u002F",
				parent_id: null,
			},
			source: "place",
			target: "event",
		},
	],
	[
		"6361",
		{ id: "6361", label: "related", parent_class: null, source: "institution", target: "place" },
	],
	[
		"10788",
		{
			id: "10788",
			label: "was chair at",
			parent_class: {
				id: 6357,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6357\u002F",
				parent_id: null,
			},
			source: "person",
			target: "institution",
		},
	],
	[
		"10999",
		{
			id: "10999",
			label: "delivered",
			parent_class: {
				id: 6358,
				label: "related",
				url: "https:\u002F\u002Fica.acdh-dev.oeaw.ac.at\u002Fapis\u002Fapi\u002Fvocabularies\u002Fvocabsbaseclass\u002F6358\u002F",
				parent_id: null,
			},
			source: "person",
			target: "event",
		},
	],
]);
