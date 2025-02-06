import type { Actions } from '@sveltejs/kit';

import { metaDataSchema } from './schema';

import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';

import { updateData } from '$lib/utils';

export const actions: Actions = {
	default: async ({ request, params }) => {

		const item_id = Number(params.item_id);

		const formData = await request.formData();
		const form = await superValidate(formData, zod(metaDataSchema));

		if (formData.has('delay')) {
			await new Promise((r) => setTimeout(r, 2000));
		}

		if (!form.valid) return fail(400, { form });

		//   Update the item in the database
		  await updateData(item_id, form.data);
	}
};
