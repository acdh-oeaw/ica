export function createKey(...parts: Array<string>): string {
	return parts.join("+");
}
