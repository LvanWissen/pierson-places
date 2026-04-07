<script lang="ts">
	import InfiniteLoading from 'svelte-infinite-loading';
	import Image from '$lib/components/ImageOverview.svelte';
	import { loadData, searchData } from '$lib/utils';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { untrack } from 'svelte';

	let filter = $state('all');
	let georeferencedFilter = $state<number | null>(null);
	let selectionFilter = $state<number | null>(null);
	let resetCounter = $state(0);

	let offset = $state(0);
	let searchQuery = $state('');
	let searchError = $state<string | null>(null);
	let searchRequestId = 0;
	let hasInitializedSearch = $state(false);
	const { data } = $props();
	let images = $state<typeof data.items>([]);
	let total = $state(0);

	// Sync from load function data (initial load / browser navigation)
	$effect(() => {
		images = data.items;
		total = data.total;
		offset = 0;
	});

	$effect(() => {
		const georeferencedParam = page.url.searchParams.get('georeferenced');
		const selectedParam = page.url.searchParams.get('selected');
		const queryParam = page.url.searchParams.get('query') ?? '';

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

		if (queryParam !== untrack(() => searchQuery)) {
			searchQuery = queryParam;
		}
	});

	const updateSearchParam = (value: string) => {
		const url = new URL(window.location.href);
		if (value) {
			url.searchParams.set('query', value);
		} else {
			url.searchParams.delete('query');
		}
		history.replaceState(history.state, '', `${resolve('/overview')}${url.search}`);
	};

	let searchDebounceTimer: ReturnType<typeof setTimeout>;

	const handleSearchInput = (event: Event) => {
		const value = (event.currentTarget as HTMLInputElement).value;
		clearTimeout(searchDebounceTimer);
		searchDebounceTimer = setTimeout(() => {
			searchQuery = value;
			updateSearchParam(value.trim());
		}, 300);
	};

	const handleScroll = async ({
		detail: { loaded, complete }
	}: {
		detail: { loaded: () => void; complete: () => void };
	}) => {
		if (searchQuery.trim()) {
			complete();
			return;
		}
		offset += 10;

		const newData = await loadData(offset, 10, georeferencedFilter, selectionFilter);
		images = [...images, ...newData.items];
		total = newData.total;

		if (images.length >= total) {
			complete();
		} else {
			loaded();
		}
	};

	$effect(() => {
		const currentQuery = searchQuery.trim();
		searchError = null;

		if (!hasInitializedSearch) {
			hasInitializedSearch = true;
			if (!currentQuery) return;
		}

		if (!currentQuery) {
			const requestId = ++searchRequestId;
			(async () => {
				try {
					const newData = await loadData(0, 10, georeferencedFilter, selectionFilter);
					if (requestId !== searchRequestId) return;
					images = newData.items;
					total = newData.total;
					offset = 0;
					resetCounter += 1;
				} catch {
					if (requestId !== searchRequestId) return;
					searchError = 'Failed to load maps';
					images = [];
					total = 0;
				}
			})();
			return;
		}

		const requestId = ++searchRequestId;
		(async () => {
			try {
				const result = await searchData(currentQuery);
				if (requestId !== searchRequestId) return;
				images = result.items;
				total = result.total;
				offset = 0;
				resetCounter += 1;
			} catch {
				if (requestId !== searchRequestId) return;
				searchError = 'Failed to load search results';
				images = [];
				total = 0;
			}
		})();
	});

	const changeFilter = async (filterValue: string | null, selectionAction?: 'toggle' | null) => {
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
				selectionAction = null;
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

		// Update URL without triggering SvelteKit's load function
		history.replaceState(history.state, '', `${resolve('/overview')}${url.search}`);

		// Fetch data directly — no page reload
		const newData = await loadData(0, 10, georeferencedFilter, selectionFilter);
		images = newData.items;
		total = newData.total;
		offset = 0;
		resetCounter += 1;
	};
</script>

<div class="flex flex-col items-center bg-gray-50 min-h-screen">
	<div class="w-full bg-white border-b border-gray-200 shadow-xs sticky top-12 z-20">
		<div class="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center h-10 gap-3">
			<span class="text-xs text-gray-400 shrink-0">
				{images.length}/{total}
			</span>

			<input
				type="search"
				class="w-28 sm:w-44 text-xs sm:text-sm rounded-md py-1 px-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
				placeholder="Search..."
				value={searchQuery}
				oninput={handleSearchInput}
			/>

			<div class="flex items-center gap-1 ml-auto shrink-0">
				<button
					class="text-xs sm:text-sm font-medium rounded-md py-1 px-2 border transition-colors {filter ===
					'all'
						? 'text-gray-800 bg-gray-200 border-gray-300'
						: 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50'}"
					onclick={() => changeFilter('all')}
				>
					All
				</button>
				<button
					class="text-xs sm:text-sm font-medium rounded-md py-1 px-2 border transition-colors {filter ===
					'georeferenced'
						? 'text-sky-700 bg-sky-100 border-sky-300'
						: 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50'}"
					onclick={() => changeFilter(filter === 'georeferenced' ? 'all' : 'georeferenced')}
				>
					Georeferenced
				</button>
				<button
					class="text-xs sm:text-sm font-medium rounded-md py-1 px-2 border transition-colors {filter ===
					'non-georeferenced'
						? 'text-orange-700 bg-orange-100 border-orange-300'
						: 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50'}"
					onclick={() => changeFilter(filter === 'non-georeferenced' ? 'all' : 'non-georeferenced')}
				>
					Not Georeferenced
				</button>
				<button
					class="text-xs sm:text-sm font-medium rounded-md py-1 px-2 border transition-colors {selectionFilter ===
					1
						? 'text-amber-700 bg-amber-100 border-amber-300'
						: 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50'}"
					onclick={() => changeFilter(null, 'toggle')}
				>
					Selected
				</button>
			</div>
		</div>
	</div>

	{#if searchError}
		<p class="text-xs sm:text-sm text-red-600 mt-4">{searchError}</p>
	{/if}

	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6"
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
