<script lang="ts">
	import { onMount, tick } from 'svelte';
	import emojijs from 'emojilib';

	import type { Instance } from 'tippy.js';

	export let callback: (url: string) => void;
	export let instance: Instance;

	let input: HTMLInputElement;
	let inputValue = '';
	const emojiList: Record<string, string[]> = emojijs;

	$: filtered = Object.keys(emojiList)
		.filter((emoji) => emojiList[emoji].some((tag) => tag.toLowerCase().startsWith(inputValue.toLowerCase())))
		.slice(0, 96);

	onMount(() => {
		tick().then(() => {
			input.focus();
		});
	});

	const handleAction = (emoji: string) => {
		callback(emoji);
		instance.destroy();
	};
</script>

<input bind:this={input} bind:value={inputValue} placeholder="search emoji" />

<div class="mt-4 grid w-full grid-cols-12 gap-2 text-2xl">
	{#each filtered as emoji (emoji)}
		<div class="col-span-1">
			<button class="h-full w-full" on:click={() => handleAction(emoji)}>
				{emoji}
			</button>
		</div>
	{/each}
</div>

<style>
	input {
		@apply w-full rounded border border-stone-200 bg-white p-3 ring-1 ring-slate-300;
	}
</style>
