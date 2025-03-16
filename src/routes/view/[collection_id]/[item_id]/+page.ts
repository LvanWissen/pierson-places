export const ssr = false;

import type { PageLoad } from './$types';
import type { MapData } from '$lib/types';
import { metaDataSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { checkAllmaps } from '$lib/utils';

export const load: PageLoad = async ({ params, fetch }) => {
	const { item_id } = params;

	const res = await fetch(`https://lvanwissen-piersonplaces.web.val.run/item/${item_id}`);

	const mapData: MapData = await res.json();

	if (mapData.isGeoreferenced == 0) {
		mapData.isGeoreferenced = await checkAllmaps({
			fetch,
			itemId: mapData.id,
			iiifInfoUrl: mapData.iiifInfoUrl
		});
	}

	return { form: await superValidate(mapData.metadata, zod(metaDataSchema)), map: mapData };
};
