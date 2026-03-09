<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>About — Pierson Places</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-12">
	<h1 class="text-3xl font-bold text-gray-900 mb-6">About</h1>

	<div class="prose prose-gray max-w-none">
		<p>
			Pierson Places is a tool that keeps track of all the maps in the collection of the University
			of Amsterdam and the Allard Pierson (
			<a
				href="https://uvaerfgoed.nl"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sky-600 hover:underline">uvaerfgoed.nl</a
			>) and checks whether they have been georeferenced via
			<a
				href="https://allmaps.org"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sky-600 hover:underline">Allmaps</a
			>.
		</p>

		<p class="mt-4 text-gray-700">
			Developed in relation to a PICA-project within the
			<a
				href="https://amsterdamtimemachine.nl"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sky-600 hover:underline">Amsterdam Time Machine</a
			>.
		</p>
	</div>

	<div class="mt-12">
		<a
			href={resolve('/overview')}
			class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors"
		>
			Explore the collection &rarr;
		</a>
	</div>
</div>
