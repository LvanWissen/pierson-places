<script lang="ts">
	export let data;

	import { CircleAlert } from 'lucide-svelte';
	import Image from '$lib/components/Image.svelte';
	import { invalidateAll } from '$app/navigation';

	$: collectionId = data.partOf;
	$: manifestId = data.manifestId;
	$: itemId = data.id;
	$: iiifInfoUrl = data.iiifInfoUrl;
	$: title = data.metadata?.name || 'Unknown Title';
	$: date = data.metadata?.publication.startDate || 'Unknown Date';
	$: isGeoreferenced = data.isGeoreferenced || 0;
	$: statistics = data.statistics || {};

	const handleNotMap = async () => {
		try {
			iiifInfoUrl = '';
			const response = await fetch(
				`https://lvanwissen-piersonplaces.web.val.run/item/${itemId}/not-a-map`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (!response.ok) {
				throw new Error('Failed to mark as not a map');
			}

			invalidateAll();
		} catch (error) {
			console.error(error);
		}
	};
</script>

<div
	class="flex flex-col items-center p-6 pb-24 sm:pb-6 space-y-6 bg-gray-50 min-h-screen justify-center"
>
	<Image {manifestId} {collectionId} {itemId} {iiifInfoUrl} {title} {date} {isGeoreferenced} />

	<div class="flex space-x-4">
		<button
			onclick={handleNotMap}
			class="text-xs lg:text-sm font-semibold rounded-xs flex items-center justify-between p-2 transition-transform hover:shadow-xs border hover:text-red-600 hover:bg-red-100 hover:border-red-300 text-red-600 bg-red-100"
			><CircleAlert class="mr-1" size="20" />
			This is not a map!
		</button>
	</div>

	<a href="/overview" class="text-sky-600 hover:underline font-sans mb-12 sm:mb-0">
		See all maps in this collection
	</a>

	<!-- Responsive Statistics Card -->
	<div
		class="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-auto md:right-4 bg-white p-2 md:p-3
		shadow-md border-t md:border border-gray-200 md:max-w-xs md:rounded-md z-10"
	>
		<div class="container mx-auto md:mx-0 max-w-lg md:max-w-none px-2 md:px-0">
			<div class="flex items-center justify-between mb-1 md:mb-2">
				<h2 class="text-xs md:text-sm font-semibold text-gray-800">Statistics</h2>
				<span class="text-xs text-gray-500 md:hidden">{statistics.total || 0} maps</span>
			</div>

			<div class="flex flex-col gap-1 md:gap-2 text-sm">
				<div class="text-center p-1 bg-gray-50 rounded-sm hidden md:block">
					<p class="text-xs text-gray-600">Total</p>
					<p class="font-bold text-gray-800">{statistics.total || 0}</p>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div class="text-center p-1 bg-gray-50 rounded-sm">
						<p class="text-xs text-gray-600">Georeferenced</p>
						<a
							href="/overview?georeferenced=true"
							class="block text-xs md:text-sm font-bold text-sky-600 hover:underline"
						>
							{statistics.georeferenced || 0}
						</a>
					</div>
					<div class="text-center p-1 bg-gray-50 rounded-sm">
						<p class="text-xs text-gray-600">Remaining</p>
						<a
							href="/overview?georeferenced=false"
							class="block text-xs md:text-sm font-bold text-sky-600 hover:underline"
						>
							{statistics.remaining || 0}
						</a>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div class="text-center p-1 bg-gray-50 rounded-sm">
						<p class="text-xs text-gray-600">Georefereced Selected</p>
						<a
							href="/overview?selected=true&georeferenced=true"
							class="block text-xs md:text-sm font-bold text-amber-600 hover:underline"
						>
							{statistics.selected || 0}
						</a>
					</div>
					<div class="text-center p-1 bg-gray-50 rounded-sm">
						<p class="text-xs text-gray-600">Remaining Selected</p>
						<a
							href="/overview?selected=true&georeferenced=false"
							class="block text-xs md:text-sm font-bold text-amber-600 hover:underline"
						>
							{statistics.remainingSelected || 0}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
