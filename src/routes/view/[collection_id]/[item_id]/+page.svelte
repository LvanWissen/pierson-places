<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import type { MetaData } from '$lib/types';

	import OSD from '$lib/components/OSD.svelte';
	import MapLibre from '$lib/components/MapLibre.svelte';
	import MetadataDisplay from '$lib/components/MetadataDisplay.svelte';
	import ViewToggle from '$lib/components/ViewToggle.svelte';

	let { data }: { data: PageData } = $props();

	let viewMode = $state('image');
	let map = $derived(data.map);

	const { form: formData } = superForm<MetaData>(data.form, {
		dataType: 'json',
		validators: undefined
	});

	let iiifId = $derived(map.iiifInfoUrl.split('/info.json')[0]);
	let annotationPageUrl = $derived(`https://annotations.allmaps.org/?url=${iiifId}`);
	let georeferenceUrl = $derived(
		`https://editor.allmaps.org/#/mask?url=${encodeURIComponent(iiifId)}`
	);
	let editUrl = $derived(`/edit/${data.map.partOf}/${data.map.id}`);
</script>

<div class="w-full flex flex-col md:flex-row" style="min-height: calc(100vh - 3rem);">
	<div
		class="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col justify-between mb-6 md:mb-0 border-r border-gray-200"
	>
		<div class="p-6 pb-0 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-800">Details</h2>
			<ViewToggle
				{viewMode}
				isGeoreferenced={map.isGeoreferenced}
				onchange={(mode) => (viewMode = mode)}
			/>
		</div>

		<MetadataDisplay
			metadata={$formData}
			isGeoreferenced={map.isGeoreferenced}
			annotationPageUrl={map.isGeoreferenced === 1 ? annotationPageUrl : ''}
			{georeferenceUrl}
			{editUrl}
		/>
	</div>

	<div class="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 relative h-[50vh] md:h-[calc(100vh-3rem)]">
		{#if viewMode === 'image' || map.isGeoreferenced === 0}
			<OSD iiifInfoUrl={map.iiifInfoUrl} />
		{:else if map.isGeoreferenced === 1 && viewMode === 'map'}
			<MapLibre {annotationPageUrl} />
		{/if}
	</div>
</div>
