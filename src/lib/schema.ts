import { z } from 'zod';

export const metaDataSchema = z.object({
	'@context': z.string(),
	'@id': z.string(),
	'@type': z.string(),
	name: z.string(),
	description: z.string(),
	publication: z.object({
		description: z.string(),
		startDate: z.string().regex(new RegExp('^[0-9]{4}$')).optional().or(z.literal('')),
		publishedBy: z.string()
	}),
	isPartOf: z.string()
});
