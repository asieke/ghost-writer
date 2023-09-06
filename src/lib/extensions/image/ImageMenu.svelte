<script lang="ts">
	import type { Instance } from 'tippy.js';

	import Unsplash from './Unsplash.svelte';
	import Emoji from './Emoji.svelte';
	import Clipboard from './Clipboard.svelte';
	import { onDestroy } from 'svelte';

	export let callback: (url: string) => void;
	export let instance: Instance;

	let state: 'unsplash' | 'clipboard' | 'emoji' = 'unsplash';
</script>

<div class="w-[500px] rounded bg-white p-6 shadow-xl">
	<div class="pb-4 text-slate-600">
		<button class={state === 'unsplash' ? 'selected' : ''} on:click={() => (state = 'unsplash')}>Unsplash</button>
		<button class={state === 'clipboard' ? 'selected' : ''} on:click|stopPropagation={() => (state = 'clipboard')}
			>Clipboard</button
		>
		<button class={state === 'emoji' ? 'selected' : ''} on:click={() => (state = 'emoji')}>Emoji</button>
	</div>
	<hr />
	{#if state === 'unsplash'}
		<Unsplash {callback} {instance} />
	{:else if state === 'clipboard'}
		<Clipboard {callback} {instance} />
	{:else if state === 'emoji'}
		<Emoji {callback} {instance} />
	{/if}
</div>
