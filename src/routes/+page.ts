import type { PageLoad } from './$types';
import type { MapData, Statistics } from '$lib/types';
import { checkAllmaps } from '$lib/utils';
import { API_BASE } from '$lib/config';

export const load: PageLoad = async ({ fetch }) => {
	const [res, resStatistics] = await Promise.all([
		fetch(`${API_BASE}/`),
		fetch(`${API_BASE}/statistics`)
	]);

	const [mapData, statistics]: [MapData, Statistics] = await Promise.all([
		res.json(),
		resStatistics.json()
	]);

	// Check allmaps in the background — don't block page load
	if (mapData.isGeoreferenced == 0) {
		checkAllmaps({ fetch, itemId: mapData.id, iiifInfoUrl: mapData.iiifInfoUrl }).then((result) => {
			mapData.isGeoreferenced = result;
		});
	}

	return {
		...mapData,
		statistics
	};
};
