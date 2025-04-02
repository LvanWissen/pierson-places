<script lang="ts">
	import MapLibrePreview from './MapLibrePreview.svelte';
	import { MapPinned, Edit } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let metadata: {
		name: string;
		description: string;
		publication: {
			description: string;
			startDate?: string;
			publishedBy: string;
		};
		isPartOf: string;
	};

	export let isGeoreferenced: number;
	export let annotationPageUrl: string;
	export let editUrl: string;
</script>

<div class="pt-8 pl-8 pr-8 p-4 grow flex flex-col justify-between">
	<div>
		<div class="mb-4">
			<h3 class="font-medium text-sm text-gray-700">Name</h3>
			<p class="mt-1 text-gray-900">{metadata.name}</p>
		</div>

		<div class="mb-4">
			<h3 class="font-medium text-sm text-gray-700">Description</h3>
			<p class="mt-1 text-gray-900">{metadata.description}</p>
		</div>

		<div class="mb-4">
			<h3 class="font-medium text-sm text-gray-700">Publication Description</h3>
			<p class="mt-1 text-gray-900">{metadata.publication.description}</p>
		</div>

		<div class="mb-4">
			<h3 class="font-medium text-sm text-gray-700">Publication Year</h3>
			<p class="mt-1 text-gray-900">{metadata.publication.startDate || 'Not specified'}</p>
		</div>

		<div class="mb-4">
			<h3 class="font-medium text-sm text-gray-700">Published By</h3>
			<p class="mt-1 text-gray-900">{metadata.publication.publishedBy}</p>
		</div>

		<div class="mb-4">
			<h3 class="font-medium text-sm text-gray-700">Collection</h3>
			<p class="mt-1 text-gray-900">{metadata.isPartOf}</p>
		</div>

		{#if isGeoreferenced === 1}
			<div class="border-t border-gray-200 my-8"></div>
			<MapLibrePreview {annotationPageUrl} />
		{/if}
	</div>

	<div class="mb-4 mt-4 flex gap-2">
		<a
			class="w-full text-xs lg:text-sm font-semibold rounded-xs flex items-center justify-center p-2 transition-transform hover:shadow-xs border hover:text-green-600 hover:bg-green-100 hover:border-green-300 text-green-600 bg-green-100"
			href={annotationPageUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			{#if isGeoreferenced === 1}
				View this map in Allmaps!
			{:else}
				Georeference this map in Allmaps!
			{/if}
			<MapPinned class="ml-1" size="20" />
		</a>

		<a
			class="w-1/2 text-xs lg:text-sm font-semibold rounded-xs flex items-center justify-center p-2 transition-transform hover:shadow-xs border hover:text-gray-600 hover:bg-gray-100 hover:border-gray-300 text-gray-600 bg-gray-100"
			href={editUrl}
			on:click|preventDefault={() => goto(editUrl)}
		>
			Edit
			<Edit class="ml-1" size="20" />
		</a>
	</div>
</div>
