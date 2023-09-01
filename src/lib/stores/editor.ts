import { writable, type Writable } from 'svelte/store';
import { Editor } from '@tiptap/core';
import { getSelectedText } from '$lib/utils';

import { extensions } from '$lib/extensions';
export const selectionText = writable('');

export const editor: Writable<Editor> = writable<Editor>(
	new Editor({
		extensions: [...extensions]
	})
);

editor.subscribe(async (e: Editor) => {
	if (e) {
		const { $from, $to } = e.state.selection;
		if ($from.pos - $to.pos !== 0) {
			selectionText.set(getSelectedText(e));
		}
	}
});
