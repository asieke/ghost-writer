<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import tippy from 'tippy.js';
	import { Link, Trash2 } from 'lucide-svelte';
	import type { Instance } from 'tippy.js';
	import { tick, onMount } from 'svelte';

	export let editor: Editor;
	let instance: Instance;
	let button: HTMLButtonElement;
	let menu: HTMLDivElement;
	let input: HTMLInputElement;
	let url = '';
	let removeShowing = false;

	onMount(() => {
		if (menu) {
			instance = tippy(button, {
				content: menu,
				showOnCreate: false,
				interactive: true,
				placement: 'bottom',
				trigger: 'click',
				offset: [110, 5],
				onShow: () => {
					tick().then(() => {
						input.focus();
						const previousURL = editor.getAttributes('link').href;
						if (previousURL) {
							url = previousURL;
							removeShowing = true;
							return;
						}
						navigator.clipboard.readText().then((text) => {
							if (text.startsWith('http')) url = text;
							input.focus();
						});
					});
				}
			});
		}
	});

	const keyHandler = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
			url = '';
			instance.hide();
		}
	};
	const removeLink = () => {
		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		url = '';
		instance.hide();
	};
</script>

<button bind:this={button} class="bubbleButton">
	<Link class="h-4 w-4" />
</button>

<div
	bind:this={menu}
	class="flex w-64 flex-row rounded border border-stone-200 bg-white p-1.5 shadow-xl ring-1 ring-slate-300"
>
	<input placeholder="http://www.example.org" bind:this={input} bind:value={url} on:keydown={keyHandler} />
	{#if removeShowing}
		<button on:click={removeLink}>
			<Trash2 class="ml-1 h-4 w-4 text-red-400" />
		</button>
	{/if}
</div>

<style lang="postcss">
	input {
		@apply w-full rounded border-[1px] border-slate-200 px-2 py-1 text-sm text-slate-600 shadow-sm;
	}
</style>
