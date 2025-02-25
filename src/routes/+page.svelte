<script>
	export let data;

	console.log('Updating page.svelte');

	import { CircleAlert } from 'lucide-svelte';
	import Image from '$lib/components/Image.svelte';
	import { invalidateAll } from '$app/navigation';

	$: collectionId = data.partOf;
	$: manifestId = data.manifestId;
	$: itemId = data.id;
	$: iiifInfoUrl = data.iiifInfoUrl;
	$: title = data.metadata?.title || 'Untitled Map';
	$: date = data.metadata?.date || 'Unknown Date';
	$: isGeoreferenced = data.isGeoreferenced || 0;

	$: permalink = data.canvasId || '';

	const handleNotMap = async () => {
		try {
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

<div class="flex flex-col items-center p-6 space-y-6 bg-gray-50 min-h-screen justify-center">
	<Image {manifestId} {collectionId} {itemId} {iiifInfoUrl} {title} {date} {isGeoreferenced} />

	<div class="flex space-x-4">
		<button
			onclick={handleNotMap}
			class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-red-600 hover:bg-red-100 hover:border-red-300 text-red-600 bg-red-100"
			><CircleAlert class="mr-1" size="20" />
			This is not a map!
		</button>
	</div>

	<a href="/overview" class="text-sky-600 hover:underline font-sans">
		See all maps in this collection
	</a>
</div>
