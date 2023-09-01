<script lang="ts">
	import { colors } from '$lib/defaults';
	import type { Editor } from '@tiptap/core';
	import tippy from 'tippy.js';
	import { Highlighter, Ban } from 'lucide-svelte';
	import type { Instance } from 'tippy.js';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';

	export let editor: Editor;

	export let action = (c: string) => editor.chain().focus().toggleHighlight({ color: c }).run();
	export let unset = () => editor.chain().focus().unsetHighlight().run();
	export let active = (c: string) => editor.isActive('highlight', { color: c });

	export let icon = Highlighter;

	let instance: Instance;
	let button: HTMLButtonElement;
	let menu: HTMLDivElement;

	let activeColor: string;

	const buttons = colors.map((c) => ({
		color: c,
		action: () => action(c),
		isActive: () => active(c)
	}));

	onMount(() => {
		if (menu) {
			instance = tippy(button, {
				content: menu,
				showOnCreate: false,
				interactive: true,
				placement: 'bottom',
				trigger: 'click'
			});
		}
		tick().then(() => {
			activeColor = buttons.filter((button) => button.isActive()).pop()?.color ?? 'none';
			console.log(activeColor);
		});
	});

	const doAction = (action: () => boolean, color: string) => {
		instance.hide();
		if (action()) {
			activeColor = color;
		}
	};
</script>

<button bind:this={button} class="bubbleButton pt-1">
	<svelte:component this={icon} class="mx-auto h-4 w-4" />
	<div class="mt-0.5 h-1 w-full" style="background-color: {activeColor === 'none' ? '' : activeColor}" />
</button>

<div bind:this={menu}>
	<div class="grid grid-cols-8 flex-col rounded-md border border-stone-200 bg-white shadow-xl ring-1 ring-slate-300">
		<button class="colorButton col-span-8 w-full text-center" on:click={() => doAction(unset, 'none')}>
			<Ban class="h-4 w-4 text-slate-200" />
		</button>
		{#each buttons as { color, action }}
			<button class="colorButton" on:click={() => doAction(action, color)}>
				<div class="h-4 w-4 rounded-sm" style="background-color: {color}" />
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	button.colorButton {
		@apply flex w-full items-center justify-center  p-0.5 align-middle text-sm text-slate-600 hover:bg-slate-100;
	}
</style>
