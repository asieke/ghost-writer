import Document from '@tiptap/extension-document';
import type { Editor } from '@tiptap/core';

export const CustomDocument = Document.extend({
	content: 'heading block*',
	addKeyboardShortcuts() {
		return {
			// ↓ your new keyboard shortcut
			'Mod-k': () => {
				window.event?.preventDefault();
				console.log('link was pressed');
				return setLink(this.editor);
			}
		};
	}
});

const setLink = (editor: Editor) => {
	const previousUrl = editor.getAttributes('link').href;
	if (previousUrl) {
		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		return true;
	}
	const url = window.prompt('URL', previousUrl);
	if (url === null) return false;
	editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	return true;
};
