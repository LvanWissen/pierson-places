import type { PageLoad } from './$types';
import type { MapData, MetaData } from '$lib/types';


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

	const data: MapData = await res.json();

	console.log('Updating from page.ts');

    if (data.isGeoreferenced == 0) {
	    data.isGeoreferenced = await checkAllmaps({ itemId: data.id, iiifInfoUrl: data.iiifInfoUrl });
    }

	return data;
};
