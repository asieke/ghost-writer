<script lang="ts">
	import { PUBLIC_UNSPLASH_KEY } from '$env/static/public';
	import { onMount, tick } from 'svelte';

	import type { Instance } from 'tippy.js';

	export let callback: (url: string) => void;
	export let instance: Instance;

	let input: HTMLInputElement;
	let query = '';
	let searchResults: Result[] = [];

	type Result = {
		id: string;
		alt_description: string;
		urls: {
			thumb: string;
			regular: string;
		};
		user: {
			username: string;
			links: {
				html: string;
			};
		};
	};

	onMount(() => {
		tick().then(() => {
			input.focus();
		});
	});

	const handleUpload = (url: string) => {
		const url2 = url.replace('&w=1080', '&w=1920');
		callback(url2);
		instance.destroy();
	};

	const handleKeyDown = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			const response = await fetch(
				`https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${PUBLIC_UNSPLASH_KEY}&per_page=16`
			);
			// const response = await fetch('/api/unsplash');
			const data = await response.json();
			console.log(data);
			searchResults = data.results as Result[];
		}
	};
</script>

<input bind:this={input} on:keydown={handleKeyDown} bind:value={query} placeholder="search unsplash" />
<div class="mt-4 grid grid-cols-4 gap-4">
	{#if searchResults.length > 0}
		{#each searchResults as result (result.id)}
			<div>
				<button
					class="h-[60px] w-[100px] bg-contain bg-center"
					style="background: url({result.urls.thumb}); background-position: center; background-size: cover;"
					on:click={() => handleUpload(result.urls.regular)}
				></button>
				<div class="text-xs text-slate-600">
					by <a href={result.user.links.html} target="_blank">{result.user.username}</a>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	input {
		@apply w-full rounded border border-stone-200 bg-white p-3 ring-1 ring-slate-300;
	}
</style>
