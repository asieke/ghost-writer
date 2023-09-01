import type { Editor } from '@tiptap/core';

/**
 * Retrieves the selected text from a given Tiptap Editor instance.
 *
 * @param {Editor} editor - An instance of the Tiptap Editor.
 * @returns {string} The selected text from the editor. Returns an empty string if no text is selected.
 *
 * @example
 * const editor = new Editor({configuration});
 * const text = getSelectedText(editor);
 * console.log(text);  // Logs the selected text or an empty string.
 */
export const getSelectedText = (editor: Editor) => {
	const str = JSON.stringify(editor.state.selection.content().toJSON());
	const matches = str.match(/"text":"([^"]*)"/g);
	if (matches && matches.length > 0) {
		const extractedTexts = matches
			.map(function (val) {
				return val.replace(/"text":"|"/g, '');
			})
			.join(' ');
		return extractedTexts;
	}
	return '';
};
