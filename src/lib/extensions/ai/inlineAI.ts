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

export default Extension.create({
	name: 'inlineAI',

	addOptions() {
		return {
			suggestion: {
				char: '  ',
				startOfLine: true,
				pluginKey: new PluginKey('inlineAI'),
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
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
						placement: 'bottom-start'
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
