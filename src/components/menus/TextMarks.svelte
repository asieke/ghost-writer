<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { Bold, Italic, Strikethrough, Underline } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const buttons = [
		{
			name: 'Bold',
			isActive: () => editor.isActive('bold'),
			icon: Bold,
			action: () => editor.chain().focus().toggleBold().run()
		},
		{
			name: 'Italic',
			isActive: () => editor.isActive('italic'),
			icon: Italic,
			action: () => editor.chain().focus().toggleItalic().run()
		},
		{
			name: 'Underline',
			isActive: () => editor.isActive('underline'),
			icon: Underline,
			action: () => editor.chain().focus().toggleUnderline().run()
		},
		{
			name: 'Strikethrough',
			isActive: () => editor.isActive('strikethrough'),
			icon: Strikethrough,
			action: () => editor.chain().focus().toggleStrike().run()
		}
	];

	let active: Record<string, boolean> = {};

	onMount(() => {
		console.log('mounting marks!');
		buttons.forEach((button) => {
			active[button.name] = button.isActive();
		});
	});

	const doAction = (fn: () => boolean, name: string) => {
		if (fn()) {
			let temp = { ...active };
			temp[name] = !active[name];
			active = temp;
		}
	};

	export let editor: Editor;
</script>

{#each buttons as { icon, action, name }}
	<button class="bubbleButton" on:click={() => doAction(action, name)}>
		<svelte:component this={icon} class="h-4 w-4 {active[name] ? 'stroke-[3px]' : 'stroke-[2px]'}" />
	</button>
{/each}
