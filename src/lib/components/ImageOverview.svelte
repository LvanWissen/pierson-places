<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Link, LoaderCircle, MapPinned, Search, SkipForward } from 'lucide-svelte';
	import { browser } from '$app/environment';

	export let collectionId: number;
	export let itemId: number;
	export let manifestId: string;

	export let isGeoreferenced: number = 0;

	let imageLoading: boolean = true;
	export let iiifInfoUrl: string;

	let showCopiedPopup: boolean = false;

	// const viewUrl = `/view/${collectionId}/${itemId}`;
	let viewUrl: string;
	let georeferenceUrl: string;

	$: viewUrl = resolve(`/view/${collectionId}/${itemId}`);

	$: georeferenceUrl = resolve(
		`https://editor.allmaps.org/#/mask?url=${encodeURIComponent(iiifInfoUrl)}`
	);

	$: thumbnailUrl = iiifInfoUrl.endsWith('info.json')
		? iiifInfoUrl.slice(0, -9) + '/full/!512,512/0/default.jpg'
		: iiifInfoUrl + '/full/!512,512/0/default.jpg';

	export let title: string = 'Unknown';
	export let date: string = 'Unknown';
	export let displayLinks: boolean = true;

	$: {
		if (iiifInfoUrl === '') {
			imageLoading = true;
		} else {
			if (browser) {
				loadImage();
			}
		}
	}

	const loadImage = (): void => {
		const image = new Image();
		image.src = thumbnailUrl;

		image.onload = () => {
			imageLoading = false;
		};
	};

	onMount((): void => {
		loadImage();
	});
</script>

<div class="w-full max-w-lg bg-white shadow-xs rounded-xs overflow-hidden">
	<div class=" bg-gray-100 flex justify-center items-center w-full aspect-square">
		{#if imageLoading}
			<LoaderCircle class="h-20 w-20 text-gray-400 animate-spin" />
		{:else}
			<img src={thumbnailUrl} alt={title} class="object-cover h-full w-full" />
		{/if}
	</div>
	<div class="p-4">
		<!-- two columns, the title and date left (80%) and a button with a link right -->
		<div class="flex justify-between items-center">
			<div class="w-4/5">
				<h2 class="text-xl font-semibold text-gray-800">{title}</h2>
				<p class="text-gray-600">{date}</p>
			</div>
			<div class="w-1/5">
				<!-- 2x2 grid with georeference button spanning bottom row -->
				<div class="grid grid-cols-2 gap-1">
					<!-- Top row: View and Link buttons -->
					<a
						class="text-xs font-semibold rounded-xs flex items-center justify-center p-1 transition-transform hover:shadow-xs border hover:text-gray-600 hover:bg-gray-100 hover:border-gray-300 text-gray-600 bg-gray-100"
						href={resolve(viewUrl)}
						title="View this map"
						target="_blank"
					>
						<Search class="ml-1" size="18" />
					</a>

					<div class="relative">
						<a
							class="text-xs font-semibold rounded-xs flex items-center justify-center p-1.5 transition-transform hover:shadow-xs border hover:text-orange-600 hover:bg-orange-100 hover:border-orange-300 text-orange-600 bg-orange-100"
							href={manifestId}
							on:click|preventDefault={() => {
								navigator.clipboard.writeText(manifestId);
								showCopiedPopup = true;
								setTimeout(() => {
									showCopiedPopup = false;
								}, 2000);
							}}
							title={manifestId}
						>
							<Link size="18" />
						</a>

						{#if showCopiedPopup}
							<div
								class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-1.5 px-2 text-xs rounded-sm shadow-md z-50"
							>
								Copied!
							</div>
						{/if}
					</div>

					<!-- Bottom row: Georeference button spanning both columns -->
					<a
						href={resolve(georeferenceUrl)}
						target="_blank"
						rel="noopener noreferrer"
						class="col-span-2 text-xs font-semibold rounded-xs flex items-center justify-center p-1.5 transition-transform hover:shadow-xs border hover:text-green-600 hover:bg-green-100 hover:border-green-300 text-green-600 bg-green-100"
						title={isGeoreferenced
							? 'Open this map in Allmaps!'
							: 'Georeference this map in Allmaps!'}
					>
						<MapPinned class="ml-1" size="18" />
					</a>
				</div>
			</div>
		</div>

		{#if displayLinks}
			<!-- Separator -->
			<div class="border-t border-gray-200 my-4"></div>

			<div class="flex justify-between">
				<a
					href={resolve(georeferenceUrl)}
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs lg:text-sm font-semibold rounded-xs flex items-center justify-between p-2 transition-transform hover:shadow-xs border hover:text-green-600 hover:bg-green-100 hover:border-green-300 text-green-600 bg-green-100"
				>
					{#if isGeoreferenced}
						Open this map in Allmaps!
					{:else}
						Georeference this map in Allmaps!
					{/if}

					<MapPinned class="ml-1" size="20" />
				</a>
				<a
					href={resolve('/overview')}
					on:click|preventDefault={() => {
						imageLoading = true;
						invalidateAll().then(() => loadImage());
					}}
					class="text-xs lg:text-sm font-semibold rounded-xs flex items-center justify-between p-2 transition-transform hover:shadow-xs border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 text-sky-600 bg-sky-100"
				>
					Next / Skip
					<SkipForward class="ml-1" size="20" />
				</a>
			</div>
		{/if}
	</div>
</div>
