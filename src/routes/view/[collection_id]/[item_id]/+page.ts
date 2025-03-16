export const ssr = false;

import type { PageLoad } from './$types';
import { metaDataSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageLoad = async ({ params }) => {
	const { item_id } = params;

	const res = await fetch(`https://lvanwissen-piersonplaces.web.val.run/item/${item_id}`);

	const data: MapData = await res.json();

	return { form: await superValidate(data.metadata, zod(metaDataSchema)), map: data };
};
