import type { MapData, MetaData } from '$lib/types';
import { API_BASE } from '$lib/config';

export const deaccent = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

export const loadData = async (
	offset = 0,
	limit = 10,
	isGeoreferenced: number | null = null,
	isSelected: number | null = null,
	orderBy = 'id',
	fetchFn: typeof fetch = fetch
) => {
	const res = await fetchFn(
		`${API_BASE}/overview?offset=${offset}&limit=${limit}&isGeoreferenced=${isGeoreferenced}&isSelected=${isSelected}&orderBy=${orderBy}`
	);

	const data: { total: number; data: MapData[] } = await res.json();

	return { items: data.data, offset, limit, total: data.total };
};

export const searchData = async (query: string, fetchFn: typeof fetch = fetch) => {
	const normalizedQuery = deaccent(query);

	if (!normalizedQuery) {
		return { items: [], offset: 0, limit: 0, total: 0 };
	}

	const res = await fetchFn(`${API_BASE}/search?query=${encodeURIComponent(normalizedQuery)}`);

	const items: MapData[] = await res.json();

	return {
		items,
		offset: 0,
		limit: items.length,
		total: items.length
	};
};

export const updateData = async (id: number, data: MetaData) => {
	const res = await fetch(`${API_BASE}/item/${id}/metadata`, {
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
		const response = await fetch(`${API_BASE}/item/${itemId}/georeferenced`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			}
		});

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

	if (data.error) {
		return 0;
	} else {
		handleGeoreferenced({ fetch, itemId });
		return 1;
	}
};
