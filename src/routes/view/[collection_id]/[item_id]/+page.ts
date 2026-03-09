export const ssr = false;

import type { PageLoad } from './$types';
import type { MapData } from '$lib/types';
import { metaDataSchema } from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { MetaData } from '$lib/types';

import { checkAllmaps } from '$lib/utils';
import { API_BASE } from '$lib/config';

export const load: PageLoad = async ({ params, fetch }) => {
	const { item_id } = params;

	const res = await fetch(`${API_BASE}/item/${item_id}`);
	const mapData: MapData = await res.json();

	// Check allmaps in the background — don't block page load
	if (mapData.isGeoreferenced == 0) {
		checkAllmaps({ fetch, itemId: mapData.id, iiifInfoUrl: mapData.iiifInfoUrl }).then((result) => {
			mapData.isGeoreferenced = result;
		});
	}

	return {
		form: await superValidate<MetaData>(mapData.metadata, zod4(metaDataSchema)),
		map: mapData
	};
};
