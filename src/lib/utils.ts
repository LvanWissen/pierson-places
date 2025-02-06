import type { MapData, MetaData } from '$lib/types';

export const loadData = async (
	offset = 0,
	limit = 10,
	isGeoreferenced: number | null = null,
	orderBy = 'id'
) => {
	const res = await fetch(
		`https://lvanwissen-piersonplaces.web.val.run/overview?offset=${offset}&limit=${limit}&isGeoreferenced=${isGeoreferenced}&orderBy=${orderBy}`
	);

	const data: {'total': number, 'data': MapData[]} = await res.json();

	console.log(data);

	return { items: data.data, offset, limit, total: data.total };
};

export const updateData = async (id: number, data: MetaData) => {
	const res = await fetch(`https://lvanwissen-piersonplaces.web.val.run/item/${id}/metadata`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	console.log(res);

	if (!res.ok) {
		throw new Error('Failed to update data');
	} else {
		// succes
		return { success: true };
	}
};