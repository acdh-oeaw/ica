type Href<T extends PageParamsInput = never> = {
	pathname: string;
	searchParams?: T;
	hash?: string;
};

export function home(hash?: string): Href {
	return { pathname: "/", hash };
}

export function imprint(hash?: string): Href {
	return { pathname: "/imprint", hash };
}

export function geoVisualisation(hash?: string): Href {
	return { pathname: "/geo-visualisation", hash };
}

export function networkVisualisation(hash?: string): Href {
	return { pathname: "/network-visualisation", hash };
}
