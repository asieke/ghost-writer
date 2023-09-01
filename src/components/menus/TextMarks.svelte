<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { Bold, Italic, Strikethrough, Underline } from 'lucide-svelte';

	export let editor: Editor;
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
			action: () => editor.chain().focus().toggleItalic().run()
		},
		{
			name: 'Strikethrough',
			isActive: () => editor.isActive('strikethrough'),
			icon: Strikethrough,
			action: () => editor.chain().focus().toggleStrike().run()
		}
	];
</script>

{#each buttons as { icon }}
	<button
		class="flex h-full w-full flex-row items-center justify-center whitespace-nowrap px-2 align-middle text-sm hover:bg-slate-100"
		on:click={() => editor.chain().focus().toggleBold().run()}
	>
		<svelte:component this={icon} class="h-4 w-4" />
	</button>
{/each}
