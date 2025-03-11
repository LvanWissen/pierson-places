import type { PageLoad } from './$types';
import type { MapData, Statistics } from '$lib/types';


const handleGeoreferenced = async ({ itemId }: { itemId: number }) => {
	try {
		const response = await fetch(
			`https://lvanwissen-piersonplaces.web.val.run/item/${itemId}/georeferenced`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			throw new Error('Failed to update georeferenced status');
		}

	} catch (error) {
		console.error(error);
	}
};

const checkAllmaps = async ({ itemId, iiifInfoUrl }: { itemId: number, iiifInfoUrl: string }) => {
	const res = await fetch(`https://annotations.allmaps.org/?url=${iiifInfoUrl}`);
	const data = await res.json();

	console.log(data);

	// if error key is present, the map is not georeferenced
	if (data.error) {
		return 0;
	} else {
		handleGeoreferenced({ itemId });
		return 1;
	}
};

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('https://lvanwissen-piersonplaces.web.val.run/');
	const resStatistics = await fetch('https://lvanwissen-piersonplaces.web.val.run/statistics');

	const mapData: MapData = await res.json();
	const statistics: Statistics = await resStatistics.json();

	console.log('Updating from page.ts');

    if (mapData.isGeoreferenced == 0) {
	    mapData.isGeoreferenced = await checkAllmaps({ itemId: mapData.id, iiifInfoUrl: mapData.iiifInfoUrl });
    }

	// Directly return the map data properties at the top level, with statistics as a separate property
	return {
		...mapData,
		statistics
	}
}