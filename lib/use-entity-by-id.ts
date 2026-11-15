import { createUrl, request, type RequestOptions } from "@acdh-oeaw/lib";
import useQuery from "swr";

import { env } from "@/config/env.config";
import type { Event, Institution, Person, Place } from "@/db/types";

const baseUrl = `${env.NEXT_PUBLIC_API_BASE_URL}/apis/api/`;

async function getPersonById(id: Person["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/person/${id}/` });
	const options: RequestOptions<"json"> = { responseType: "json" };

	const result = await request(url, options);
	if (result.error != null) throw result.error;
	return result.value.data;
}

export function usePersonById(id: Person["id"]) {
	return useQuery(["person", "by-id", { id }], () => {
		return getPersonById(id);
	});
}

async function getPlaceById(id: Place["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/place/${id}/` });
	const options: RequestOptions<"json"> = { responseType: "json" };

	const result = await request(url, options);
	if (result.error != null) throw result.error;
	return result.value.data;
}

export function usePlaceById(id: Place["id"]) {
	return useQuery(["place", "by-id", { id }], () => {
		return getPlaceById(id);
	});
}

async function getInstitutionById(id: Institution["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/institution/${id}/` });
	const options: RequestOptions<"json"> = { responseType: "json" };

	const result = await request(url, options);
	if (result.error != null) throw result.error;
	return result.value.data;
}

export function useInstitutionById(id: Institution["id"]) {
	return useQuery(["institution", "by-id", { id }], () => {
		return getInstitutionById(id);
	});
}

async function getEventById(id: Event["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/event/${id}/` });
	const options: RequestOptions<"json"> = { responseType: "json" };

	const result = await request(url, options);
	if (result.error != null) throw result.error;
	return result.value.data;
}

export function useEventById(id: Event["id"]) {
	return useQuery(["event", "by-id", { id }], () => {
		return getEventById(id);
	});
}
