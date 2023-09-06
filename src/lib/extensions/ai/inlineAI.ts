import { Extension } from '@tiptap/core';
import type { Editor, Range } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import InlineAI from './InlineAI.svelte';
import tippy from 'tippy.js';
import type { Instance as TippyInstance } from 'tippy.js';

export interface PropsType {
	editor: Editor;
	range: Range;
	clientRect: () => DOMRect;
}

interface CommandProps {
	command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export default Extension.create({
	name: 'inlineAI',

	addOptions() {
		return {
			suggestion: {
				char: '  ',
				startOfLine: true,
				pluginKey: new PluginKey('inlineAI'),
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: CommandProps }) => {
					props.command({ editor, range });
				}
			}
		};
	},

	addProseMirrorPlugins() {
		this.options.suggestion.render = () => {
			let component: InlineAI, popup: TippyInstance;

			return {
				onStart: (props: PropsType) => {
					// get the dom element from the editor
					const triggerElement = props.editor.view.domAtPos(props.range.from).node as HTMLElement;

					console.log(triggerElement.getBoundingClientRect(), window.innerWidth);
					const left = triggerElement.getBoundingClientRect().left;
					const width = window.innerWidth;
					const adjustment = left > width / 2 ? 600 - (width - left) : 0;

					const element = document.createElement('div');
					component = new InlineAI({
						target: element,
						props: {
							editor: props.editor,
							range: props.range
						}
					});

					popup = tippy('body', {
						getReferenceClientRect: props.clientRect,
						appendTo: () => document.body,
						content: element,
						showOnCreate: true,
						interactive: true,
						trigger: 'manual',
						placement: 'bottom-start',
						maxWidth: 600,
						offset: [-10 - adjustment, 10]
					})[0];
				},

				onExit() {
					popup.destroy();
					component.$destroy();
				}
			};
		};

		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	}
});
