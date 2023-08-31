import BubbleMenu from '@tiptap/extension-bubble-menu';
import { PluginKey } from '@tiptap/pm/state';
import FontMenu from './FontMenu.svelte';

const element = document.createElement('div');
new FontMenu({
	target: element
});

export const CustomFontMenu = BubbleMenu.configure({
	pluginKey: new PluginKey('TextMenu'),
	element: element,
	shouldShow({ editor }) {
		try {
			const { $from, $to } = editor.state.selection;
			if ($from.pos - $from.parentOffset === 1) {
				return false;
			}

			if ($from.pos - $to.pos !== 0) {
				return true;
			}

			return false;
		} catch (e) {
			return false;
		}
	},
	tippyOptions: {
		moveTransition: 'transform 0.15s ease-out',
		zIndex: 30,
		duration: 100
	}
});
