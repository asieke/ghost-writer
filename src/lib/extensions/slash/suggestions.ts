//suggestions.ts - line items for slash menu

import Slash from './Slash.svelte';
import tippy from 'tippy.js';
import type { Instance as TippyInstance } from 'tippy.js';
import type { Editor, Range } from '@tiptap/core';
import { Heading1, Heading2, Heading3, Code, Minus, Table, Sparkles, Quote } from 'lucide-svelte';

export interface ItemType {
	title: string;
	icon: ConstructorOfATypedSvelteComponent;
	query?: string;
	command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export interface PropsType {
	editor: Editor;
	range: Range;
	clientRect: () => DOMRect;
	items: ItemType[];
}

export default {
	items: ({ query }: { query: string }) => {
		return [
			{
				title: 'AI Magic',
				icon: Sparkles,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					console.log('AI Magic!!!!');
					editor.chain().focus().deleteRange(range).insertContent('?').run();
				}
			},
			{
				title: 'Heading 1',
				icon: Heading1,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
				}
			},
			{
				title: 'Heading 2',
				icon: Heading2,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
				}
			},
			{
				title: 'Heading 3',
				icon: Heading3,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
				}
			},
			{
				title: 'Blockquote',
				icon: Quote,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).toggleBlockquote().run();
				}
			},
			{
				title: 'Horizontal Rule',
				icon: Minus,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().deleteRange(range).focus().setHorizontalRule().run();
				}
			},
			{
				title: 'Code',
				icon: Code,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().deleteRange(range).focus().toggleCodeBlock().run();
				}
			},
			{
				title: 'Table',
				icon: Table,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor
						.chain()
						.deleteRange(range)
						.focus()
						.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
						.scrollIntoView()
						.run();
				}
			}
		]
			.filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
			.slice(0, 10);
	},

	render: () => {
		let component: Slash, popup: TippyInstance;
		// let selected = false;

		return {
			onStart: (props: PropsType) => {
				const element = document.createElement('div');
				component = new Slash({
					target: element,
					props: {
						editor: props.editor,
						range: props.range,
						items: props.items
					}
				});

				popup = tippy('body', {
					getReferenceClientRect: props.clientRect,
					appendTo: () => document.body,
					content: element,
					showOnCreate: true,
					interactive: true,
					trigger: 'manual',
					placement: 'bottom-start'
				})[0];
			},

			onUpdate(props: PropsType) {
				component.$set({
					editor: props.editor,
					range: props.range,
					items: props.items
				});
				if (!props.clientRect) {
					return;
				}

				popup.setProps({
					getReferenceClientRect: props.clientRect
				});
			},

			onKeyDown(props: { event: KeyboardEvent }) {
				if (props.event.key === 'Escape') {
					popup.hide();
					return true;
				}
				if (props.event.key === 'Enter') {
					// selected = true;
					props.event.preventDefault();
					return true;
				}
			},

			onExit() {
				popup.destroy();
				component.$destroy();
			}
		};
	}
};
