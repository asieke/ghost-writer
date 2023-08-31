import { Extension } from '@tiptap/core';
import type { Editor, Range } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import slashSuggestions from './suggestions';

import { PluginKey } from '@tiptap/pm/state';

export type Item = {
	title: string;
	icon: ConstructorOfATypedSvelteComponent;
	command: (props: { editor: Editor; range: Range }) => void;
};

const slashExtension = Extension.create({
	name: 'slash',

	addOptions() {
		return {
			suggestion: {
				char: '/',
				pluginKey: new PluginKey('slash'),
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
					props.command({ editor, range });
				}
			}
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	}
});

export const Slash = slashExtension.configure({
	suggestion: slashSuggestions
});
