import EmojiList from './EmojiList.svelte';
import tippy from 'tippy.js';
import type { Instance as TippyInstance } from 'tippy.js';
import type { Editor, Range } from '@tiptap/core';
import type { SvelteComponent } from 'svelte';
import emojijs from 'emojilib';

export interface ItemType {
	title: string;
	icon: SvelteComponent;
	query?: string;
	command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export interface PropsType {
	editor: Editor;
	range: Range;
	clientRect: () => DOMRect;
	items: ItemType[];
}

const emojiList: Record<string, string[]> = emojijs;

const items = Object.keys(emojiList).map((emoji) => ({
	title: emoji,
	tags: emojiList[emoji],
	command: ({ editor, range }: { editor: Editor; range: Range }) => {
		editor
			.chain()
			.focus()
			.deleteRange(range)
			.insertContent(emoji + ' ')
			.run();
	}
}));

export default {
	items: ({ query }: { query: string }) => {
		return items
			.filter((item) => item.tags.some((tag) => tag.toLowerCase().startsWith(query.toLowerCase())))
			.slice(0, 64);
	},

	render: () => {
		let component: EmojiList, popup: TippyInstance;
		let selected = false;

		return {
			onStart: async (props: PropsType) => {
				const element = document.createElement('div');
				component = new EmojiList({
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
					selected = true;
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
