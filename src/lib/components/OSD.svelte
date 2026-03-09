<script lang="ts">
	import { onMount } from 'svelte';
	import OpenSeadragon, { type Viewer } from 'openseadragon';

	let { iiifInfoUrl }: { iiifInfoUrl: string } = $props();

	let container: HTMLDivElement;
	let viewer: Viewer;

	onMount(() => {
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
			tileSources: [iiifInfoUrl]
		});

		return () => {
			if (viewer) {
				viewer.destroy();
			}
		};
	});
</script>

<div bind:this={container} class="w-full md:bg-gray-100 h-full min-h-full"></div>
