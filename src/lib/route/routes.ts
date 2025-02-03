export function home(hash?: string) {
	return { pathname: "/", hash };
}

export function imprint(hash?: string) {
	return { pathname: "/imprint", hash };
}

export function geoVisualisation(hash?: string) {
	return { pathname: "/geo-visualisation", hash };
}

export function networkVisualisation(hash?: string) {
	return { pathname: "/network-visualisation", hash };
}
