<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { WarpedMapLayer } from '@allmaps/maplibre';
	import 'maplibre-gl/dist/maplibre-gl.css';

	export let annotationPageUrl: string;

	let mapContainer: HTMLDivElement;

	onMount(() => {
		// MapLibre map with base layer
		const map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
			center: [0, 0],
			zoom: 2,
			// Pitch is currently not supported by the Allmaps plugin for MapLibre
			maxPitch: 0
		});

		const warpedMapLayer = new WarpedMapLayer();

		map.on('load', () => {
			map.addLayer(warpedMapLayer);
			warpedMapLayer.addGeoreferenceAnnotationByUrl(annotationPageUrl);
		});

		map.on('warpedmapadded', (event) => {
			const bbox = warpedMapLayer.getBounds();

			if (bbox) {
				map.fitBounds(bbox, {
					padding: 50,
					speed: 1.8
				});
			}
		});

		return () => {
			map.remove();
		};
	});
</script>

<div bind:this={mapContainer} class="h-full w-full bg-gray-100"></div>
