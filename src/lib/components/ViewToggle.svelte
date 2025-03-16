<script lang="ts">
	export let viewMode: string;
	export let isGeoreferenced: number;
</script>

<div class="flex">
	<button
		class={`text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 ${viewMode === 'image' ? 'text-sky-600 bg-sky-100' : 'text-gray-600 bg-gray-100'} mr-2`}
		on:click={() => (viewMode = 'image')}
	>
		Image
	</button>
	<button
		class={`text-xs lg:text-sm font-semibold rounded-sm flex items-center justify-between p-2 transition-transform hover:shadow-sm border ${
			isGeoreferenced === 1
				? `hover:text-sky-600 hover:bg-sky-100 hover:border-sky-300 ${viewMode === 'map' ? 'text-sky-600 bg-sky-100' : 'text-gray-600 bg-gray-100'}`
				: 'text-gray-400 bg-gray-100 cursor-not-allowed'
		}`}
		on:click={() => {
			if (isGeoreferenced === 1) {
				viewMode = 'map';
			}
		}}
		disabled={isGeoreferenced !== 1}
		title={isGeoreferenced !== 1 ? "This map hasn't been georeferenced yet" : ''}
	>
		Map
	</button>
</div>
