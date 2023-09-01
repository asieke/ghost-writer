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

/* eslint-disable @typescript-eslint/no-explicit-any */
type DebouncedFunction<T extends any[], R> = (...args: T) => R;
/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <T extends any[], R>(fn: DebouncedFunction<T, R>, ms = 300) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return function (this: any, ...args: T) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
};
