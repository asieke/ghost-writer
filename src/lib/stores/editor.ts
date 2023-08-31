import { writable, type Writable } from 'svelte/store';
import { Editor } from '@tiptap/core';

import { extensions } from '$lib/extensions';

export const editor: Writable<Editor> = writable<Editor>(
	new Editor({
		extensions: [...extensions]
	})
);

// editor.subscribe(async (e: Editor) => {
// 	console.log('editor is updating', e);
// });
