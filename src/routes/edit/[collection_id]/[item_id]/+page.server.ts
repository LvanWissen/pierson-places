import type { Actions } from '@sveltejs/kit';

import { metaDataSchema } from '$lib/schema';

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { updateData } from '$lib/utils';
import type { MetaData } from '$lib/types';

export const actions: Actions = {
	default: async ({ request, params }) => {
		const item_id = Number(params.item_id);

		const formData = await request.formData();
		const form = await superValidate<MetaData>(formData, zod4(metaDataSchema));

		if (formData.has('delay')) {
			await new Promise((r) => setTimeout(r, 2000));
		}

		if (!form.valid) return fail(400, { form });

		//   Update the item in the database
		await updateData(item_id, form.data);
	}
};
