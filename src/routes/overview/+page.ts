export const ssr = false;
import type { PageLoad } from './$types';

import { loadData } from '$lib/utils';

export const load: PageLoad = async ({ url, fetch }) => {
	const georeferencedParam = url.searchParams.get('georeferenced');
	let georeferencedFilter: number | null = null;

	if (georeferencedParam === 'true') {
		georeferencedFilter = 1;
	} else if (georeferencedParam === 'false') {
		georeferencedFilter = 0;
	}

	const selectionParam = url.searchParams.get('selected');
	let selectionFilter: number | null = null;
	if (selectionParam === 'true') {
		selectionFilter = 1;
	} else if (selectionParam === 'false') {
		selectionFilter = 0;
	}

	return loadData(0, 10, georeferencedFilter, selectionFilter, 'id', fetch);
};
