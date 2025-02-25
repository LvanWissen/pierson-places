<script lang="ts">
	import { onMount } from 'svelte';
	import OpenSeadragon, { Viewer } from 'openseadragon';

	import { superForm } from 'sveltekit-superforms';
	import { Field, Control, Label, Description, FieldErrors } from 'formsnap';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { metaDataSchema } from './schema';
	import SuperDebug from 'sveltekit-superforms';

	export let data;

	let map = data.map;

	let container: HTMLDivElement;
	let viewer: Viewer;
	let tileSources: string[] = [map.iiifInfoUrl];

	const form = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		validators: zodClient(metaDataSchema)
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
			tileSources: tileSources
		});

		console.log(viewer);
	});
</script>

<div class="w-full flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 min-h-screen">
	<!-- Sidebar with metadata -->
	<div class="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col justify-between">
		<!-- Metadata -->
		<form method="POST" use:enhance>
			<div class="pt-8 pl-8 p-4 flex-grow">
				<h2 class="text-xl font-semibold text-gray-800">Edit</h2>

				<Field {form} name="name">
					<Control>
						{#snippet children({ props })}
							<Label>Name</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.name}
								class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
							/>
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>

				<Field {form} name="description">
					<Control>
						{#snippet children({ props })}
							<Label>Description</Label>
							<textarea
								{...props}
								bind:value={$formData.description}
								class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
							></textarea>
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>

				<Field {form} name="publication.description">
					<Control>
						{#snippet children({ props })}
							<Label>Publication Description</Label>
							<textarea
								{...props}
								bind:value={$formData.publication.description}
								class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
							></textarea>
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>

				<Field {form} name="publication.startDate">
					<Control>
						{#snippet children({ props })}
							<Label>Publication Start Date:</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.publication.startDate}
								class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
							/>
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>

				<Field {form} name="publication.publishedBy">
					<Control>
						{#snippet children({ props })}
							<Label>Published By</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.publication.publishedBy}
								class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
							/>
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>

				<Field {form} name="isPartOf">
					<Control>
						{#snippet children({ props })}
							<Label>Is Part Of</Label>
							<input
								{...props}
								type="text"
								bind:value={$formData.isPartOf}
								class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
							/>
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>

				<!-- <div>
				<code>
					<pre>{JSON.stringify(map, null, 2)}</pre>
				</code>
			</div> -->
			</div>
			<!-- Save button at the bottom -->
			<div class="p-4 flex justify-end mb-4">
				<button
					class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 text-sky-600 bg-sky-100"
				>
					Save
				</button>
			</div>
		</form>
	</div>
	<div class="w-full md:w-2/3 lg:w-3/4 xl:w-4/5">
		<!-- OSD viewer -->
		<div bind:this={container} class="h-full w-full bg-gray-100"></div>
	</div>
</div>
<SuperDebug data={$formData} />
