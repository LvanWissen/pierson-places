<script lang="ts">
	import { onMount } from 'svelte';
	import OpenSeadragon, { type Viewer } from 'openseadragon';

	import { superForm } from 'sveltekit-superforms';
	import { Field, Control, Label, FieldErrors } from 'formsnap';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { metaDataSchema } from '$lib/schema';
	import type { PageData } from './$types';
	import type { MetaData } from '$lib/types';

	let { data }: { data: PageData } = $props();

	let map = $derived(data.map);

	let container: HTMLDivElement;
	let viewer: Viewer;

	const form = superForm<MetaData>(data.form, {
		dataType: 'json',
		resetForm: false,
		validators: zod4Client(metaDataSchema)
	});
	const { form: formData, enhance } = form;

	onMount(async () => {
		viewer = OpenSeadragon({
			element: container,
			crossOriginPolicy: 'Anonymous',
			showRotationControl: false,
			showFullPageControl: false,
			showHomeControl: false,
			showNavigator: false,
			showSequenceControl: false,
			showZoomControl: false,
			gestureSettingsMouse: {
				clickToZoom: false
			},
			tileSources: [map.iiifInfoUrl]
		});
	});
</script>

<div class="w-full flex flex-col md:flex-row" style="min-height: calc(100vh - 3rem);">
	<div
		class="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col justify-between mb-6 md:mb-0 border-r border-gray-200"
	>
		<form method="POST" use:enhance>
			<div class="p-6 space-y-4">
				<h2 class="text-xl font-semibold text-gray-800">Edit Metadata</h2>

				<Field {form} name="name">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium text-gray-700 mb-1">Name</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.name}
								class="p-2.5 block w-full border border-gray-300 rounded-md shadow-xs text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none transition-shadow"
							/>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600 mt-1" />
				</Field>

				<Field {form} name="description">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium text-gray-700 mb-1">Description</Label>
							<textarea
								{...props}
								bind:value={$formData.description}
								rows="3"
								class="p-2.5 block w-full border border-gray-300 rounded-md shadow-xs text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none transition-shadow"
							></textarea>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600 mt-1" />
				</Field>

				<Field {form} name="publication.description">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium text-gray-700 mb-1"
								>Publication Description</Label
							>
							<textarea
								{...props}
								bind:value={$formData.publication.description}
								rows="3"
								class="p-2.5 block w-full border border-gray-300 rounded-md shadow-xs text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none transition-shadow"
							></textarea>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600 mt-1" />
				</Field>

				<Field {form} name="publication.startDate">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium text-gray-700 mb-1">Publication Year</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.publication.startDate}
								placeholder="e.g. 1882"
								class="p-2.5 block w-full border border-gray-300 rounded-md shadow-xs text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none transition-shadow"
							/>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600 mt-1" />
				</Field>

				<Field {form} name="publication.publishedBy">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium text-gray-700 mb-1">Published By</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.publication.publishedBy}
								class="p-2.5 block w-full border border-gray-300 rounded-md shadow-xs text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none transition-shadow"
							/>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600 mt-1" />
				</Field>

				<Field {form} name="isPartOf">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium text-gray-700 mb-1">Collection</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.isPartOf}
								class="p-2.5 block w-full border border-gray-300 rounded-md shadow-xs text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none transition-shadow"
							/>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600 mt-1" />
				</Field>
			</div>

			<div class="p-6 pt-0">
				<button
					type="submit"
					class="w-full text-sm font-semibold rounded-md flex items-center justify-center py-2.5 px-4 transition-colors border border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100 hover:border-sky-400"
				>
					Save Changes
				</button>
			</div>
		</form>
	</div>

	<div class="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 h-[50vh] md:h-[calc(100vh-3rem)]">
		<div bind:this={container} class="h-full w-full bg-gray-100"></div>
	</div>
</div>
