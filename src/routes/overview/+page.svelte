<script lang="ts">
	import InfiniteLoading from 'svelte-infinite-loading';
	import Image from '$lib/components/ImageOverview.svelte';
	import { loadData } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let filter = $state('all');
	let georeferencedFilter = $state<number | null>(null);
	let selectionFilter = $state<number | null>(null);
	let resetCounter = $state(0);

	let offset = $state(0);
	const { data } = $props();
	let images = $derived(data.items);
	let total = $derived(data.total);
	let lastData = $derived(data);

	$effect(() => {
		const georeferencedParam = page.url.searchParams.get('georeferenced');
		const selectedParam = page.url.searchParams.get('selected');

		if (georeferencedParam === 'true') {
			filter = 'georeferenced';
			georeferencedFilter = 1;
		} else if (georeferencedParam === 'false') {
			filter = 'non-georeferenced';
			georeferencedFilter = 0;
		} else {
			filter = 'all';
			georeferencedFilter = null;
		}

		if (selectedParam === 'true') {
			selectionFilter = 1;
		} else if (selectedParam === 'false') {
			selectionFilter = 0;
		} else {
			selectionFilter = null;
		}
	});

	const handleScroll = async ({
		detail: { loaded, complete }
	}: {
		detail: { loaded: () => void; complete: () => void };
	}) => {
		offset += 10;
		console.log('Loading more data', offset);

		const newData = await loadData(offset, 10, georeferencedFilter, selectionFilter);
		images = [...images, ...newData.items];
		total = newData.total;

		if (images.length >= total) {
			console.log('All data loaded');
			complete();
		} else {
			loaded();
		}
	};

	const changeFilter = (filterValue: string | null, selectionAction?: 'toggle' | null) => {
		const url = new URL(window.location.href);

		// Handle georeferenced filter
		if (filterValue !== null) {
			filter = filterValue;

			if (filter === 'georeferenced') {
				georeferencedFilter = 1;
				url.searchParams.set('georeferenced', 'true');
			} else if (filter === 'non-georeferenced') {
				georeferencedFilter = 0;
				url.searchParams.set('georeferenced', 'false');
			} else if (filter === 'all') {
				georeferencedFilter = null;
				selectionFilter = null;
				url.searchParams.delete('georeferenced');
				url.searchParams.delete('selected');
				selectionAction = null; // Don't process selection when "all" is clicked
			}
		}

		// Handle selection filter
		if (selectionAction === 'toggle') {
			if (selectionFilter === 1) {
				selectionFilter = 0;
				url.searchParams.set('selected', 'false');
			} else {
				selectionFilter = 1;
				url.searchParams.set('selected', 'true');
			}
		}

		const nextPath = `${resolve('/overview')}${url.search}`;
		goto(nextPath, { replaceState: true, keepFocus: true });

		// Reset and reload data
		offset = -10;
		images = [];
		resetCounter += 1;
	};

	$effect.pre(() => {
		if (!data || data === lastData) return;

		lastData = data;
		images = data.items;
		total = data.total;
		offset = 0;
	});
</script>

<div class="flex flex-col items-center space-y-6 bg-gray-50 min-h-screen">
	<div
		class="w-full flex flex-row flex-wrap sm:flex-row justify-between items-center sticky top-0 bg-gray-50 z-20 p-3 sm:p-8 border-b shadow-xs"
	>
		<div class="flex items-center sm:block">
			<div>
				<h1 class="text-lg sm:text-2xl font-semibold text-gray-800">Maps Overview</h1>
				<p class="text-xs sm:text-base text-gray-600">Showing {images.length} of {total} maps</p>
			</div>
		</div>
		<div class="flex items-center sm:flex sm:justify-end sm:mt-4">
			<button
				class="text-xs sm:text-sm font-medium sm:font-semibold rounded-xs py-1 px-2 sm:p-2 transition-transform hover:shadow-xs border hover:text-gray-600 hover:bg-gray-100 hover:border-gray-300 text-gray-600 bg-gray-100 mr-1.5 sm:mr-2"
				onclick={() => changeFilter('all')}
			>
				<span class="hidden sm:inline">{filter === 'all' ? 'Showing all' : 'Show all'}</span>
				<span class="sm:hidden">All</span>
			</button>
			<button
				class="text-xs sm:text-sm font-medium sm:font-semibold rounded-xs py-1 px-2 sm:p-2 transition-transform hover:shadow-xs border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 text-sky-600 bg-sky-100 mr-1.5 sm:mr-2"
				onclick={() =>
					changeFilter(filter === 'georeferenced' ? 'non-georeferenced' : 'georeferenced')}
			>
				<span class="hidden sm:inline">
					{filter === 'georeferenced' ? 'Show Non-Georeferenced' : 'Show Georeferenced'}
				</span>
				<span class="sm:hidden">{filter === 'georeferenced' ? 'Non-Geo' : 'Geo'}</span>
			</button>
			<button
				class="text-xs sm:text-sm font-medium sm:font-semibold rounded-xs py-1 px-2 sm:p-2 transition-transform hover:shadow-xs border hover:text-amber-600 hover:bg-amber-100 hover:border-amber-300 text-amber-600 bg-amber-100"
				onclick={() => changeFilter(null, 'toggle')}
			>
				<span class="hidden sm:inline">
					{selectionFilter === 1 ? 'Show Unselected' : 'Show Selected'}
				</span>
				<span class="sm:hidden">
					{selectionFilter === 1 ? 'Unselected' : 'Selected'}
				</span>
			</button>
		</div>
	</div>

	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-8"
	>
		{#each images as image (image.id)}
			<div class="w-full">
				<Image
					manifestId={image.manifestId}
					iiifInfoUrl={image.iiifInfoUrl}
					title={image.metadata.name}
					date={image.metadata.publication.startDate}
					displayLinksBottom={false}
					displayLinksRight={true}
					collectionId={image.partOf}
					itemId={image.id}
					isGeoreferenced={image.isGeoreferenced}
				/>
			</div>
		{/each}
	</div>
</div>

{#key resetCounter}
	<InfiniteLoading on:infinite={handleScroll} spinner="spiral" />
{/key}
