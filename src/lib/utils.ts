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

/**
 * Generates a random alphanumeric hash string of length 32.
 *
 * @returns {string} The generated random hash string.
 * @example
 * const hash = generateRandomHash();
 * "k1sd8g2j3h1k4j2m5n6o8p9q0r1s4t3u"
 */
export const generateRandomHash = () => {
	return Array(32)
		.join()
		.split(',')
		.map(function () {
			return (~~(Math.random() * 36)).toString(36);
		})
		.join('');
};
