interface MapData {
	id: number;
	metadata: MetaData;
	iiifInfoUrl: string;
	partOf: number;
	isGeoreferenced: number;
	isValidated: number;
	canvasId: string;
	manifestId: string;
	isNotAMap: number;
}

interface MetaData {
	title: string;
	description: string;
	date: string;
	creator: string;
	subject: string;
	type: string;
	format: string;
	identifier: string;
	source: string;
}

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
