<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Map, LayoutGrid, Home, Info } from 'lucide-svelte';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
	<header class="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-30">
		<div class="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center h-12">
			<a
				href={resolve('/')}
				class="flex items-center gap-2 text-gray-900 hover:text-sky-600 transition-colors shrink-0"
			>
				<Map size="20" />
				<span class="font-semibold text-sm sm:text-base">Pierson Places</span>
			</a>
			<nav class="flex items-center gap-1 ml-auto shrink-0">
				<a
					href={resolve('/')}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors {page
						.url.pathname === resolve('/')
						? 'text-sky-600 bg-sky-50'
						: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
				>
					<Home size="16" />
					<span class="hidden sm:inline">Home</span>
				</a>
				<a
					href={resolve('/overview')}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors {page.url.pathname.startsWith(
						resolve('/overview')
					)
						? 'text-sky-600 bg-sky-50'
						: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
				>
					<LayoutGrid size="16" />
					<span class="hidden sm:inline">Overview</span>
				</a>
				<a
					href={resolve('/about')}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors {page.url.pathname.startsWith(
						resolve('/about')
					)
						? 'text-sky-600 bg-sky-50'
						: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
				>
					<Info size="16" />
					<span class="hidden sm:inline">About</span>
				</a>
			</nav>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>
</div>
