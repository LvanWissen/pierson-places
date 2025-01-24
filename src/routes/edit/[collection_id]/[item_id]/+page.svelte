<script lang="ts">
	import { onMount } from 'svelte';
	import OpenSeadragon, { Viewer } from 'openseadragon';

	let data = $props();
	let map = data.data;

	let container: HTMLDivElement;
	let viewer: Viewer;
	let tileSources: string[] = [map.iiifInfoUrl];

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
	<div class="w-full md:w-1/5 flex flex-col justify-between">
		<!-- Metadata -->
		<div class="pt-8 pl-8 p-4 flex-grow">
			<h2 class="text-xl font-semibold text-gray-800">Edit</h2>
			<div class="mt-4">
				<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
				<input
					type="text"
					id="title"
					name="title"
					class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
					value={map.metadata.title}
				/>
			</div>
			<div class="mt-4">
				<label for="date" class="block text-sm font-medium text-gray-700">Date</label>
				<input
					type="text"
					id="date"
					name="date"
					class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
					value={map.metadata.date}
				/>
			</div>
			<div class="mt-4">
				<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
				<textarea
					id="description"
					name="description"
					rows="3"
					class="p-2.5 mt-1 block w-full border-gray-300 rounded-sm shadow-sm sm:text-sm focus:ring-sky-500 focus:border-sky-500"
					>{map.metadata.description}</textarea
				>
			</div>
			<div>
				<code>
					<pre>{JSON.stringify(map, null, 2)}</pre>
				</code>
			</div>
		</div>
		<!-- Save button at the bottom -->
		<div class="p-4 flex justify-end mb-4">
			<button
				class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 text-sky-600 bg-sky-100"
			>
				Save
			</button>
		</div>
	</div>
	<div class="w-full md:w-4/5">
		<!-- OSD viewer -->
		<div bind:this={container} class="h-full w-full bg-gray-100"></div>
	</div>
</div>
