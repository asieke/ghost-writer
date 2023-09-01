<svelte:options accessors={true} />

<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { TextSelection } from '@tiptap/pm/state';
	import type { Attrs, Node as ProseNode } from '@tiptap/pm/model';
	import { onDestroy, onMount } from 'svelte';
	import {
		ChevronRight,
		Delete,
		Trash2,
		CornerDownRight,
		CornerUpRight,
		Heading1,
		Text,
		Heading1Icon,
		Heading2Icon,
		Heading3Icon,
		CodeIcon,
		Table,
		Quote
	} from 'lucide-svelte';

	export let editor: Editor;
	export let node: ProseNode;
	export let pos: number;
	export let onDelete: () => void;

	let type: string;

	const handleKeydown = (e: KeyboardEvent) => {
		e.preventDefault();

		if (e.key === 'ArrowDown') {
			console.log('pressed down');

			if (subselection !== -1 && subselection < (buttons[selection].subButtons?.length || 0) - 1) {
				subselection++;
			} else if (subselection === -1 && selection < buttons.length - 1) selection++;
		}

		if (e.key === 'ArrowUp') {
			if (subselection !== -1 && subselection >= 1) {
				subselection--;
			} else if (subselection === -1 && selection >= 1) selection--;
		}

		if (e.key === 'ArrowRight') {
			if (buttons[selection].subButtons) {
				subselection = 0;
			}
		}
		if (e.key === 'ArrowLeft') {
			subselection = -1;
		}

		if (e.key === 'Enter') {
			if (buttons[selection].subButtons && subselection >= 0) {
				buttons[selection]?.subButtons?.[subselection].action();
			}
			if (!buttons[selection].subButtons && selection >= 0) {
				buttons[selection].action();
			}
		}
	};

	let selection = -1;
	let subselection = -1;

	const setSelection = (s1: number, s2: number) => {
		selection = s1;
		subselection = s2;
	};

	//DELETE NODE
	const remove = () => {
		console.log('removing....', node);

		let tr = editor.state.tr.delete(pos, pos + node.nodeSize);
		editor.view.dispatch(tr);
		onDelete();
	};

	const insert = (ab: 'above' | 'below', nodeType: string, attrs?: Attrs) => {
		let schema = editor.schema;
		console.log(schema);
		let type = nodeType === 'blockquote' ? 'paragraph' : nodeType;
		let newNode = editor.schema.nodes[type].create(attrs);
		let tr = editor.state.tr.insert(ab === 'above' ? pos : pos + node.nodeSize, newNode);
		editor.view.dispatch(tr);
		console.log(tr, pos);

		editor
			.chain()
			.focus(ab === 'above' ? pos + 1 : pos + node.nodeSize + 1)
			.insertContent('')
			.run();

		if (nodeType === 'blockquote') editor.commands.toggleBlockquote();
		onDelete();
	};

	const getTextButtons = (ab: 'above' | 'below') => [
		{
			icon: Text,
			title: 'Paragraph',
			action: () => insert(ab, 'paragraph')
		},
		{
			icon: Heading1Icon,
			title: 'Heading 1',
			action: () => insert(ab, 'heading', { level: 1 })
		},
		{
			icon: Heading2Icon,
			title: 'Heading 2',
			action: () => insert(ab, 'heading', { level: 2 })
		},
		{
			icon: Heading3Icon,
			title: 'Heading 3',
			action: () => insert(ab, 'heading', { level: 3 })
		},
		{
			icon: CodeIcon,
			title: 'Code Block',
			action: () => insert(ab, 'codeBlock')
		},
		{
			icon: Quote,
			title: 'Blockquote',
			action: () => insert(ab, 'blockquote')
		}
	];

	const buttons = [
		{
			icon: Trash2,
			title: 'Delete',
			action: remove
		},
		{
			icon: CornerUpRight,
			title: 'Add Above',
			action: () => null,
			subButtons: getTextButtons('above')
		},
		{
			icon: CornerDownRight,
			title: 'Add Below',
			action: () => null,
			subButtons: getTextButtons('below')
		}
	];

	onDestroy(() => {
		console.log('we destroying');
	});

	onMount(() => {
		if (!editor || !node || !pos) return;
		type = node.type.name;
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="absolute -left-6 -top-12 w-32 pt-10">
	<div class=" menu">
		<!-- <button on:click|stopPropagation={remove}>{type}</button> -->

		{#each buttons as { icon, title, subButtons, action }, i}
			<button
				on:click|stopPropagation={action}
				on:mouseenter={() => setSelection(i, subButtons ? 0 : -1)}
				class="flex h-9 w-full flex-row items-center justify-between px-2 align-middle text-sm text-slate-600 {selection ===
				i
					? 'bg-slate-100'
					: 'bg-white'} relative"
			>
				{#if subButtons}
					<div class="flex flex-row items-center align-middle">
						<svelte:component this={icon} class="mr-1 h-4 w-4" /><span>{title}</span>
					</div>
					<ChevronRight class="h-4 w-4 stroke-2" />
					{#if selection === i && subselection !== -1}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="submenu" on:mouseleave={() => setSelection(selection, -1)}>
							{#each subButtons as { icon, title, action }, j}
								<button
									on:click|stopPropagation={action}
									on:mouseenter={() => setSelection(selection, j)}
									class="flex h-9 w-full flex-row items-center px-2 align-middle text-sm text-slate-600 {subselection ===
									j
										? 'bg-slate-100'
										: 'bg-white'} relative"
								>
									<svelte:component this={icon} class="mr-1 h-4 w-4" />{title}
								</button>
							{/each}
						</div>
					{/if}
				{:else}
					<div class="flex flex-row items-center align-middle">
						<Trash2 class="mr-1 h-4 w-4" /><span>{title}</span>
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	.menu > button:first-child {
		@apply rounded-t-lg;
	}

	.menu > button:last-child {
		@apply rounded-b-lg;
	}

	.submenu > button:first-child {
		@apply rounded-t-lg;
	}

	.submenu > button:last-child {
		@apply rounded-b-lg;
	}

	.submenu {
		@apply absolute -top-[1px] left-[126px] w-32 border-[1px] border-slate-300 shadow-lg;
		@apply rounded-lg;
	}

	.menu {
		@apply rounded-lg border-[1px] border-slate-300 font-sans text-base font-normal shadow-lg;
	}
</style>
