import { Extension } from '@tiptap/core';
import type { Editor, Range } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import emojiSuggestions from './suggestions';

const emojiExtension = Extension.create({
	name: 'emoji',

	addOptions() {
		return {
			suggestion: {
				char: ':',
				pluginKey: new PluginKey('emoji'),
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

export const Emoji = emojiExtension.configure({
	suggestion: emojiSuggestions
});
