import { createUrl, request, type RequestConfig } from "@acdh-oeaw/lib";
import useQuery from "swr";

import { baseUrl } from "@/config/api.config";
import type { Event, Institution, Person, Place } from "@/db/types";

function getPersonById(id: Person["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/person/${id}/` });
	const options: RequestConfig = { responseType: "json" };

	return request(url, options);
}

export function usePersonById(id: Person["id"]) {
	return useQuery(["person", "by-id", { id }], () => {
		return getPersonById(id);
	});
}

function getPlaceById(id: Place["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/place/${id}/` });
	const options: RequestConfig = { responseType: "json" };

	return request(url, options);
}

export function usePlaceById(id: Place["id"]) {
	return useQuery(["place", "by-id", { id }], () => {
		return getPlaceById(id);
	});
}

function getInstitutionById(id: Institution["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/institution/${id}/` });
	const options: RequestConfig = { responseType: "json" };

	return request(url, options);
}

export function useInstitutionById(id: Institution["id"]) {
	return useQuery(["institution", "by-id", { id }], () => {
		return getInstitutionById(id);
	});
}

function getEventById(id: Event["id"]) {
	const url = createUrl({ baseUrl, pathname: `entities/event/${id}/` });
	const options: RequestConfig = { responseType: "json" };

	return request(url, options);
}

export function useEventById(id: Event["id"]) {
	return useQuery(["event", "by-id", { id }], () => {
		return getEventById(id);
	});
}
