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

	const impossibleParam = url.searchParams.get('impossible');
	let impossibleFilter: number | null = null;
	if (impossibleParam === 'true') {
		impossibleFilter = 1;
	} else if (impossibleParam === 'false') {
		impossibleFilter = 0;
	}

	const notAMapParam = url.searchParams.get('notamap');
	let notAMapFilter: number | null = null;
	if (notAMapParam === 'true') {
		notAMapFilter = 1;
	} else if (notAMapParam === 'false') {
		notAMapFilter = 0;
	}

	return loadData(0, 10, georeferencedFilter, impossibleFilter, notAMapFilter, 'id', fetch);
};
