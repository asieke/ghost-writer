<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import tippy from 'tippy.js';
	import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-svelte';
	import type { Instance } from 'tippy.js';
	import { SvelteComponent, onMount } from 'svelte';

	type SvelteIconComponent = typeof AlignCenter & SvelteComponent;

	export let editor: Editor;
	let instance: Instance;
	let button: HTMLButtonElement;
	let menu: HTMLDivElement;

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
	});

	let buttons = [
		{
			icon: AlignCenter as SvelteIconComponent,
			isActive: () => editor.isActive({ textAlign: 'center' }),
			action: () => editor.chain().focus().setTextAlign('center').run()
		},
		{
			icon: AlignLeft as SvelteIconComponent,
			isActive: () => editor.isActive({ textAlign: 'left' }),
			action: () => editor.chain().focus().setTextAlign('left').run()
		},
		{
			icon: AlignRight as SvelteIconComponent,
			isActive: () => editor.isActive({ textAlign: 'right' }),
			action: () => editor.chain().focus().setTextAlign('right').run()
		},
		{
			icon: AlignJustify as SvelteIconComponent,
			isActive: () => editor.isActive({ textAlign: 'justify' }),
			action: () => editor.chain().focus().setTextAlign('justify').run()
		}
	];

	let activeIcon = (buttons.filter((button) => button.isActive()).pop()?.icon ?? AlignLeft) as SvelteIconComponent;

	const doAction = (action: () => boolean, icon: SvelteIconComponent) => {
		instance.hide();
		if (action()) {
			activeIcon = icon;
		}
	};
</script>

<button bind:this={button} class="bubbleButton">
	<svelte:component this={activeIcon} class="h-4 w-4" />
</button>

<div bind:this={menu}>
	<div class="flex flex-row justify-evenly rounded border border-stone-200 bg-white shadow-xl ring-1 ring-slate-300">
		{#each buttons as { icon, action }}
			<button class="action" on:click={() => doAction(action, icon)}>
				<svelte:component this={icon} class="h-4 w-4" />
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	button.action {
		@apply flex w-full items-center justify-start px-2 py-2 align-middle text-sm text-slate-600 hover:bg-slate-100;
	}
</style>
