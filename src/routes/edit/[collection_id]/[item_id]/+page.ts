export const ssr = false;

import type { PageLoad } from './$types';
import type { MapData } from '$lib/types';
import { metaDataSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { MetaData } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { item_id } = params;

	// Use the fetch passed to the load function for best results
	const res = await fetch(`https://lvanwissen-piersonplaces.web.val.run/item/${item_id}`);

	const data: MapData = await res.json();

	console.log(data);

	return {
		form: await superValidate<MetaData>(data.metadata, zod4(metaDataSchema)),
		map: data
	};
};
