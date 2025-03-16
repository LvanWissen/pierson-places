<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { goto } from '$app/navigation';

	// Import components
	import OSD from '$lib/components/OSD.svelte';
	import MapLibre from '$lib/components/MapLibre.svelte';
	import MetadataDisplay from '$lib/components/MetadataDisplay.svelte';
	import ViewToggle from '$lib/components/ViewToggle.svelte';

	export let data;

	let viewMode = 'image';
	let map = data.map;

	// Keep form data but don't use enhance
	const { form: formData } = superForm(data.form, {
		dataType: 'json',
		validators: undefined // No need for validators in read-only mode
	});

	const iiifId = map.iiifInfoUrl.split('/info.json')[0];
	const annotationPageUrl = `https://annotations.allmaps.org/?url=${iiifId}`;

	const handleGeoreference = () => {
		const allmapsUrl =
			map.isGeoreferenced === 1
				? `https://allmaps.org/maps?url=${encodeURIComponent(iiifId)}`
				: `https://editor.allmaps.org/#/mask?url=${encodeURIComponent(iiifId)}`;

		window.open(allmapsUrl, '_blank');
	};

	const handleEdit = () => {
		goto(`/edit/${data.map.partOf}/${data.map.id}`);
	};
</script>

<div class="w-full flex flex-col md:flex-row min-h-screen">
	<!-- Metadata section - Full width on small screens -->
	<div class="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col justify-between mb-6 md:mb-0">
		<div class="pt-8 pl-8 pr-8 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-800">Details</h2>
			<ViewToggle bind:viewMode isGeoreferenced={map.isGeoreferenced} />
		</div>

		<MetadataDisplay
			metadata={$formData}
			isGeoreferenced={map.isGeoreferenced}
			onGeoreference={handleGeoreference}
			onEdit={handleEdit}
			{annotationPageUrl}
		/>
	</div>

	<!-- Image/Map section - Set explicit height on small screens -->
	<div class="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 relative h-[50vh] md:h-screen">
		{#if viewMode === 'image' || map.isGeoreferenced === 0}
			<OSD iiifInfoUrl={map.iiifInfoUrl} />
		{:else if map.isGeoreferenced === 1 && viewMode === 'map'}
			<MapLibre {annotationPageUrl} />
		{/if}
	</div>
</div>
