<script>
	import InfiniteLoading from 'svelte-infinite-loading';

	import Image from '$lib/components/Image.svelte';

	import { loadData } from '$lib/utils';

	let filter = 'all';

	let offset = 0;
	export let data;
	$: images = data.items;

	const handleScroll = async ({ detail: { loaded, complete } }) => {
		offset += 10;
		console.log('Loading more data', offset);

		const newData = await loadData(offset);
		images = [...images, ...newData.items];

		if (images.length >= data.total) {
			complete();
		} else {
			loaded();
		}
	};
</script>

<div class="flex flex-col items-center space-y-6 bg-gray-50 min-h-screen justify-center">
	<div class="w-full flex justify-between items-center sticky top-0 bg-gray-50 z-10 p-8 border-b">
		<div>
			<h1 class="text-2xl font-semibold text-gray-800">Maps Overview</h1>
			<p class="text-gray-600">Showing {images.length} of {data.total} maps</p>
		</div>
		<div class="flex justify-end mt-4">
			<button
				class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-gray-600 hover:bg-gray-100 hover:border-gray-300 text-gray-600 bg-gray-100 mr-2"
				on:click={() => (filter = 'all')}
			>
				Showing all
			</button>
			<button
				class="rtext-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 text-sky-600 bg-sky-100"
				on:click={() =>
					(filter = filter === 'georeferenced' ? 'non-georeferenced' : 'georeferenced')}
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
					iiifInfoUrl={image.iiifInfoUrl}
					title={image.metadata.title}
					date={image.metadata.date}
					displayLinks={false}
					collectionId={image.partOf}
					itemId={image.id}
				/>
			</div>
		{/each}
	</div>
</div>
<InfiniteLoading on:infinite={handleScroll} spinner="spiral" />
