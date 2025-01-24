export const ssr = false;
import type { PageLoad } from './$types';

import { loadData } from '$lib/utils';

export const load: PageLoad = async () => {
	return loadData(0, 10, null, 'id');
};
