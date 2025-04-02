export type MapData = {
	id: number;
	metadata: MetaData;
	iiifInfoUrl: string;
	partOf: number;
	isGeoreferenced: number;
	isValidated: number;
	canvasId: string;
	manifestId: string;
	isNotAMap: number;
};

export type MetaData = {
	'@context': string;
	'@id': string;
	'@type': string;
	name: string;
	description: string;
	publication: {
		description: string;
		startDate: string;
		publishedBy: string;
	};
	isPartOf: string;
};

export type Statistics = {
	total: number;
	georeferenced: number;
	remaining: number;
	selected: number;
	remainingSelected: number;
};
