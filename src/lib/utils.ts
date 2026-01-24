import type { MapData, MetaData } from '$lib/types';

export const loadData = async (
	offset = 0,
	limit = 10,
	isGeoreferenced: number | null = null,
	isSelected: number | null = null,
	orderBy = 'id',
	fetchFn: typeof fetch = fetch
) => {
	const res = await fetchFn(
		`https://lvanwissen-piersonplaces.web.val.run/overview?offset=${offset}&limit=${limit}&isGeoreferenced=${isGeoreferenced}&isSelected=${isSelected}&orderBy=${orderBy}`
	);

	const data: { total: number; data: MapData[] } = await res.json();

	return { items: data.data, offset, limit, total: data.total };
};

export const updateData = async (id: number, data: MetaData) => {
	const res = await fetch(`https://lvanwissen-piersonplaces.web.val.run/item/${id}/metadata`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (!res.ok) {
		throw new Error('Failed to update data');
	} else {
		// succes
		return { success: true };
	}
};

const handleGeoreferenced = async ({
	fetch,
	itemId
}: {
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
	itemId: number;
}) => {
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

export const checkAllmaps = async ({
	fetch,
	itemId,
	iiifInfoUrl
}: {
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
	itemId: number;
	iiifInfoUrl: string;
}) => {
	const res = await fetch(`https://annotations.allmaps.org/?url=${iiifInfoUrl}`);
	const data = await res.json();

	// if error key is present, the map is not georeferenced
	if (data.error) {
		return 0;
	} else {
		handleGeoreferenced({ fetch, itemId });
		return 1;
	}
};
