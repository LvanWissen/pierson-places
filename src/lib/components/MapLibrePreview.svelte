<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';

	import { parseAnnotation } from '@allmaps/annotation';
	import { GcpTransformer } from '@allmaps/transform';

	import type { GeoJSON } from 'geojson';

	export let annotationPageUrl = '';

	let mapContainer: HTMLDivElement;
	let map: maplibregl.Map;

	const getGeoJson = async (annotationPageUrl: string) => {
		const annotationPage = await fetch(annotationPageUrl).then((res) => res.json());

		const features = [];
		for (const annotation of annotationPage.items) {
			const map = parseAnnotation(annotation);

			const gcps = map[0].gcps;
			const transformer = new GcpTransformer(gcps, 'thinPlateSpline');

			const coords = annotation.target.selector.value
				.match(/points="(.*?)"/)[1]
				.split(' ')
				.map((coord: string) => coord.split(',').map((i: string) => +i));

			const polygon = transformer.transformForwardAsGeojson([coords]);
			features.push({
				type: 'Feature',
				properties: {},
				geometry: polygon
			});
		}

		return {
			type: 'FeatureCollection',
			features
		};
	};

	onMount(() => {
		const initializeMap = async () => {
			if (!annotationPageUrl) {
				return;
			}

			const geojson = await getGeoJson(annotationPageUrl);

			// MapLibre map with base layer
			map = new maplibregl.Map({
				container: mapContainer,
				style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
				center: [0, 0],
				zoom: 2
			});

			map.on('load', () => {
				map.addSource('polygon', {
					type: 'geojson',
					data: geojson as GeoJSON
				});

				map.addLayer({
					id: 'polygon',
					type: 'fill',
					source: 'polygon',
					paint: {
						'fill-color': '#0284c7',
						'fill-opacity': 0.3
					}
				});

				const bounds = new maplibregl.LngLatBounds();

				for (const feature of geojson.features) {
					const c = feature.geometry.coordinates.flat(Infinity) as number[];
					for (let i = 0; i < c.length - 1; i += 2) {
						bounds.extend([c[i] as number, c[i + 1] as number]);
					}
				}

				map.fitBounds(bounds, {
					padding: 50,
					animate: false
				});
			});
		};

		initializeMap();
		return () => {
			map?.remove();
		};
	});
</script>

<div bind:this={mapContainer} class="min-h-96 w-full"></div>
