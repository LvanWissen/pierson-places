<script lang="ts">
	interface Props {
		viewMode: string;
		isGeoreferenced: number;
		onchange?: (mode: string) => void;
	}

	let { viewMode, isGeoreferenced, onchange }: Props = $props();
</script>

<div class="flex">
	<button
		class={`text-xs lg:text-sm font-semibold rounded-xs flex items-center justify-between p-2 transition-transform hover:shadow-xs border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 ${viewMode === 'image' ? 'text-sky-600 bg-sky-100' : 'text-gray-600 bg-gray-100'} mr-2`}
		onclick={() => onchange?.('image')}
	>
		Image
	</button>
	<button
		class={`text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-xs border ${
			isGeoreferenced === 1
				? `hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 ${viewMode === 'map' ? 'text-sky-600 bg-sky-100' : 'text-gray-600 bg-gray-100'}`
				: 'text-gray-400 bg-gray-100 cursor-not-allowed'
		}`}
		onclick={() => {
			if (isGeoreferenced === 1) {
				onchange?.('map');
			}
		}}
		disabled={isGeoreferenced !== 1}
		title={isGeoreferenced !== 1 ? "This map hasn't been georeferenced yet" : ''}
	>
		Map
	</button>
</div>
