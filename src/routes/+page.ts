import type { PageLoad } from './$types';
import type { MapData, Statistics } from '$lib/types';
import { checkAllmaps } from '$lib/utils';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('https://lvanwissen-piersonplaces.web.val.run/');
	const resStatistics = await fetch('https://lvanwissen-piersonplaces.web.val.run/statistics');

	const mapData: MapData = await res.json();
	const statistics: Statistics = await resStatistics.json();

	console.log('Updating from page.ts');

	if (mapData.isGeoreferenced == 0) {
		mapData.isGeoreferenced = await checkAllmaps({
			fetch,
			itemId: mapData.id,
			iiifInfoUrl: mapData.iiifInfoUrl
		});
	}

	// Directly return the map data properties at the top level, with statistics as a separate property
	return {
		...mapData,
		statistics
	};
};
