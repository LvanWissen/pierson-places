/**
 * Fetches all not-yet-georeferenced maps from the database and checks each one
 * against the Allmaps annotation service. If a map is found to be georeferenced,
 * it updates the database accordingly.
 *
 * Run with: npm run check:georeferenced
 */

const API_BASE = 'https://lvanwissen-piersonplaces.web.val.run';
const ALLMAPS_API = 'https://annotations.allmaps.org/';

/** Milliseconds to wait between each Allmaps API call. */
const DELAY_MS = 500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads a page of non-georeferenced maps from the database.
 * @param {number} offset
 * @param {number} limit
 * @returns {Promise<{ total: number, data: Array<{ id: number, iiifInfoUrl: string }> }>}
 */
async function fetchPage(offset, limit) {
	const url = `${API_BASE}/overview?offset=${offset}&limit=${limit}&isGeoreferenced=0&isSelected=null&orderBy=id`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(
			`Failed to fetch overview page (offset=${offset}): ${res.status} ${res.statusText}`
		);
	}
	return res.json();
}

/**
 * Checks whether a map has been georeferenced on Allmaps.
 * @param {string} iiifInfoUrl
 * @returns {Promise<boolean>}
 */
async function isGeoreferencedOnAllmaps(iiifInfoUrl) {
	const res = await fetch(`${ALLMAPS_API}?url=${encodeURIComponent(iiifInfoUrl)}`);
	if (!res.ok) {
		// A 404 means no annotation exists yet — treat as not georeferenced.
		if (res.status === 404) return false;
		throw new Error(`Allmaps API error for ${iiifInfoUrl}: ${res.status} ${res.statusText}`);
	}
	const data = await res.json();
	return !data.error;
}

/**
 * Marks a map as georeferenced in the database.
 * @param {number} id
 */
async function markGeoreferenced(id) {
	const res = await fetch(`${API_BASE}/item/${id}/georeferenced`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) {
		throw new Error(`Failed to mark item ${id} as georeferenced: ${res.status} ${res.statusText}`);
	}
}

async function main() {
	const PAGE_SIZE = 50;
	let offset = 0;
	let total = Infinity;
	let checked = 0;
	let updated = 0;

	console.log('Starting georeferencing check…\n');

	while (offset < total) {
		const page = await fetchPage(offset, PAGE_SIZE);
		total = page.total;

		if (page.data.length === 0) break;

		console.log(`Processing items ${offset + 1}–${offset + page.data.length} of ${total}`);

		for (const item of page.data) {
			try {
				const georeferenced = await isGeoreferencedOnAllmaps(item.iiifInfoUrl);
				checked++;

				if (georeferenced) {
					await markGeoreferenced(item.id);
					updated++;
					console.log(`  ✓ Item ${item.id} is georeferenced — database updated`);
				} else {
					process.stdout.write(`  · Item ${item.id} not yet georeferenced\r`);
				}
			} catch (err) {
				console.error(`  ✗ Error processing item ${item.id}: ${err.message}`);
			}

			await sleep(DELAY_MS);
		}

		offset += page.data.length;
	}

	console.log(`\nDone. Checked ${checked} items, updated ${updated}.`);
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
