export const ssr = false;

import type { PageLoad } from './$types';
import type { MapData } from '$lib/types';
import { metaDataSchema } from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { MetaData } from '$lib/types';
import { API_BASE } from '$lib/config';

export const load: PageLoad = async ({ params, fetch }) => {
	const { item_id } = params;

	const res = await fetch(`${API_BASE}/item/${item_id}`);

	const data: MapData = await res.json();

	return {
		form: await superValidate<MetaData>(data.metadata, zod4(metaDataSchema)),
		map: data
	};
};
