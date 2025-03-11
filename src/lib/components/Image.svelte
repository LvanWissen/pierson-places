<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { Link, LoaderCircle, MapPinned, SkipForward } from 'lucide-svelte';
	import { browser } from '$app/environment';

	const handleEdit = (): void => {
		window.location.href = `/edit/${collectionId}/${itemId}`;
	};

	const handleLink = (): void => {
		navigator.clipboard.writeText(manifestId);

		// Show popup and hide after timeout
		showCopiedPopup = true;
		setTimeout(() => {
			showCopiedPopup = false;
		}, 2000);
	};

	const handleNext = (): void => {
		imageLoading = true;

		invalidateAll().then(() => loadImage());
	};

	const handleGeoreference = (): void => {
		// Open new window with Allmaps https://editor.allmaps.org/#/mask?url=https%253A%252F%252Frotterdamspubliek.nl%252Fiiif%252FNL-RtSA_4201_I-138-02-5%252Finfo.json
		window.open(`https://editor.allmaps.org/#/mask?url=${encodeURIComponent(iiifInfoUrl)}`);
	};

	export let collectionId: number;
	export let itemId: number;
	export let manifestId: string;

	export let isGeoreferenced: number = 0;

	let imageLoading: boolean = true;
	export let iiifInfoUrl: string;

	// Add state for popup visibility
	let showCopiedPopup: boolean = false;

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

<div class="w-full max-w-lg bg-white shadow-sm rounded-sm overflow-hidden">
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
			<div class="w-1/5 flex justify-end">
				<!-- An edit metadata button -->

				<button
					class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-gray-600 hover:bg-gray-100 hover:border-gray-300 text-gray-600 bg-gray-100 mr-2"
					onclick={handleEdit}
				>
					Edit
				</button>

				<div class="relative">
					<button
						class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-orange-600 hover:bg-orange-100 hover:border-orange-300 text-orange-600 bg-orange-100"
						onclick={handleLink}
						title="Copy Manifest URI"
					>
						<Link size="20" class="text-orange" />
					</button>

					{#if showCopiedPopup}
						<div
							class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded shadow-md z-50"
						>
							Copied!
						</div>
					{/if}
				</div>
			</div>
		</div>
		{#if displayLinks}
			<!-- Separator -->
			<div class="border-t border-gray-200 my-4"></div>

			<div class="flex justify-between">
				<button
					onclick={handleGeoreference}
					class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-green-600 hover:bg-green-100 hover:border-green-300 text-green-600 bg-green-100"
				>
					{#if isGeoreferenced}
						Open this map in Allmaps!
					{:else}
						Georeference this map in Allmaps!
					{/if}

					<MapPinned class="ml-1" size="20" />
				</button>
				<button
					onclick={handleNext}
					class="text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 text-sky-600 bg-sky-100"
				>
					Next / Skip
					<SkipForward class="ml-1" size="20" />
				</button>
			</div>
		{/if}
	</div>
</div>
