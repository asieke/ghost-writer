<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import tippy from 'tippy.js';
	import {
		CheckSquare,
		ChevronDown,
		Code,
		Heading1,
		Heading2,
		Heading3,
		ListOrdered,
		RemoveFormatting,
		TextQuote
	} from 'lucide-svelte';
	import type { Instance } from 'tippy.js';
	import { onMount } from 'svelte';

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

	$: buttons = [
		{
			name: 'Text',
			icon: RemoveFormatting,
			isActive: () => editor.isActive('paragraph') && !editor.isActive('bulletList') && !editor.isActive('orderedList'),
			action: () => {
				editor.chain().focus().unsetBlockquote().unsetCode().unsetAllMarks().toggleNode('paragraph', 'paragraph').run();
			}
		},
		{
			name: 'Code',
			isActive: () => editor.isActive('codeBlock'),
			icon: Code,
			action: () => editor.chain().focus().toggleCodeBlock().run()
		},
		{
			name: 'Heading 1',
			isActive: () => editor.isActive('heading', { level: 1 }),
			icon: Heading1,
			action: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
		},
		{
			name: 'Heading 2',
			isActive: () => editor.isActive('heading', { level: 2 }),
			icon: Heading2,
			action: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
		},
		{
			name: 'Heading 3',
			isActive: () => editor.isActive('heading', { level: 3 }),
			icon: Heading3,
			action: () => editor.chain().focus().toggleHeading({ level: 3 }).run()
		},
		{
			name: 'Quote',
			icon: TextQuote,
			action: () => editor.chain().focus().toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
			isActive: () => editor.isActive('blockquote')
		},
		{
			name: 'To-do List',
			icon: CheckSquare,
			action: () => editor.chain().focus().toggleTaskList().run(),
			isActive: () => editor.isActive('taskItem')
		},
		{
			name: 'Bullet List',
			icon: ListOrdered,
			action: () => editor.chain().focus().toggleBulletList().run(),
			isActive: () => editor.isActive('bulletList')
		},
		{
			name: 'Numbered List',
			icon: ListOrdered,
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: () => editor.isActive('orderedList')
		}
	];

	$: activeItem = buttons.filter((button) => button.isActive()).pop() ?? {
		name: 'Multiple'
	};

	const doAction = (action: () => void) => {
		console.log('doing action');
		instance.hide();
		action();
	};
</script>

<button
	bind:this={button}
	class="flex h-full flex-row items-center justify-center whitespace-nowrap px-2 align-middle text-sm hover:bg-slate-100"
>
	<div>{activeItem.name}</div>
	<ChevronDown class="ml-1 h-4 w-4" />
</button>

<div bind:this={menu}>
	<div
		class="flex w-40 flex-col justify-evenly rounded border border-stone-200 bg-white shadow-xl ring-1 ring-slate-300"
	>
		{#each buttons as { icon, action, name }}
			<button class="action" on:click={() => doAction(action)}>
				<svelte:component this={icon} class="mr-2 h-4 w-4 border-[1px] border-slate-300 p-0.5" />
				<div>{name}</div>
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	button.action {
		@apply flex w-full items-center justify-start px-2 py-2 align-middle text-sm text-slate-600 hover:bg-slate-100;
	}
</style>
