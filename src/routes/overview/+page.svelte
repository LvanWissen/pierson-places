<script lang="ts">
	import InfiniteLoading from 'svelte-infinite-loading';
	import Image from '$lib/components/Image.svelte';
	import { loadData } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let filter = 'all';
	let georeferencedFilter: number | null = null;
	let resetCounter = 0;

	let offset = 0;
	export let data;
	$: images = data.items;
	$: total = data.total;

	$: {
		const param = page.url.searchParams.get('georeferenced');

		if (param === 'true') {
			filter = 'georeferenced';
			georeferencedFilter = 1;
		} else if (param === 'false') {
			filter = 'non-georeferenced';
			georeferencedFilter = 0;
		} else {
			filter = 'all';
			georeferencedFilter = null;
		}
	}

	const handleScroll = async ({ detail: { loaded, complete } }) => {
		offset += 10;
		console.log('Loading more data', offset);

		const newData = await loadData(offset, 10, georeferencedFilter);
		images = [...images, ...newData.items];
		total = newData.total;

		if (images.length >= total) {
			console.log('All data loaded');
			complete();
		} else {
			loaded();
		}
	};

	const changeFilter = (filterValue: string) => {
		filter = filterValue;
		const url = new URL(window.location.href);

		if (filter === 'georeferenced') {
			georeferencedFilter = 1;
			url.searchParams.set('georeferenced', 'true');
		} else if (filter === 'non-georeferenced') {
			georeferencedFilter = 0;
			url.searchParams.set('georeferenced', 'false');
		} else {
			georeferencedFilter = null;
			url.searchParams.delete('georeferenced');
		}

		goto(url.toString(), { replaceState: true, keepFocus: true });

		// Reset and reload data
		offset = -10;
		images = [];

		resetCounter += 1;
	};
</script>

<div class="flex flex-col items-center space-y-6 bg-gray-50 min-h-screen">
	<div
		class="w-full flex justify-between items-center sticky top-0 bg-gray-50 z-20 p-8 border-b shadow-sm"
	>
		<div>
			<h1 class="text-2xl font-semibold text-gray-800">Maps Overview</h1>
			<p class="text-gray-600">Showing {images.length} of {total} maps</p>
		</div>
		<div class="flex justify-end mt-4">
			<button
				class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-gray-600 hover:bg-gray-100 hover:border-gray-300 text-gray-600 bg-gray-100 mr-2"
				on:click={() => changeFilter('all')}
			>
				{filter === 'all' ? 'Showing all' : 'Show all'}
			</button>
			<button
				class="rtext-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 text-sky-600 bg-sky-100"
				on:click={() =>
					changeFilter(filter === 'georeferenced' ? 'non-georeferenced' : 'georeferenced')}
			>
				{filter === 'georeferenced' ? 'Show Non-Georeferenced' : 'Show Georeferenced'}
			</button>
		</div>
	</div>

	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-8"
	>
		{#each images as image}
			<div class="w-full">
				<Image
					manifestId={image.manifestId}
					iiifInfoUrl={image.iiifInfoUrl}
					title={image.metadata.name}
					date={image.metadata.publication.startDate}
					displayLinks={false}
					collectionId={image.partOf}
					itemId={image.id}
				/>
			</div>
		{/each}
	</div>
</div>

{#key resetCounter}
	<InfiniteLoading on:infinite={handleScroll} spinner="spiral" />
{/key}
