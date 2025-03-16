<script lang="ts">
	import { onMount } from 'svelte';
	import OpenSeadragon, { Viewer } from 'openseadragon';

	export let iiifInfoUrl: string;

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

<div bind:this={container} class="h-full w-full bg-gray-100"></div>
