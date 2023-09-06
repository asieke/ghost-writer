/* Store for saving files to local storage */

import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { editor as storeEditor } from './editor';
import { saveToast } from '$lib/stores/toast';
import { db, placeholderDocument } from '$lib/clients/dexie';
import type { Document } from '$types/database';

export const fileStore = {
	/**
	 * Fetches the current document ID from the database.
	 * @returns {Promise<number>} The current document ID.
	 */
	getCurrentId: async () => {
		return (await db.get('currentId')) as number;
	},

	/**
	 * Retrieves the current document based on the ID from the database.
	 * @returns {Promise<Document>} The current document.
	 */
	getCurrentDocument: async () => {
		const id = (await db.get('currentId')) as number;
		const doc = (await db.documents.get(id)) || placeholderDocument;
		return doc;
	},

	/**
	 * Fetches the contents for the document picker.
	 * @returns {Promise<Array>} An array containing document IDs, titles, and icons.
	 */
	getContents: async () => {
		const contents: { id: number; title: string; icon: string }[] = [];
		await db.documents.orderBy('id').each((doc) => {
			if (!doc.id || !doc.icon || !doc.title) return;
			contents.push({ id: doc.id, icon: doc.icon, title: doc.title });
		});
		return contents;
	},

	/**
	 * Saves the current state of the document.
	 */
	saveDocument: async () => {
		console.log('saving document');
		saveToast.set('saving...');
		const editor = get(storeEditor);

		if (browser && editor) {
			const html = editor.getHTML();
			const id = get(currentId);
			const match = html.match(/<[^>]+>([^<]+)<\/[^>]+>/);
			const title = match ? match[1] : '';

			//update the database
			await db.documents.update(id, { html, title });

			//update the contents store
			currentDocument.set(await fileStore.getCurrentDocument());
			contents.set(await fileStore.getContents());
		}

		setTimeout(() => {
			saveToast.set('saved');
		}, 300);
	},

	/**
	 * Updates the current document with new partial data.
	 * @param {Partial<Document>} newDocument The new document data to merge.
	 */
	updateDocument: async (newDocument: Partial<Document>) => {
		console.log(newDocument);

		currentDocument.update((d) => ({ ...d, ...newDocument }));
		await db.documents.update(get(currentId), get(currentDocument));

		contents.set(await fileStore.getContents());
	},

	/**
	 * Deletes the current document.
	 */
	deleteDocument: async () => {
		const editor = get(storeEditor);

		console.log('deleting document');
		if ((await db.documents.count()) > 1) {
			const id = get(currentId);
			await db.documents.delete(id);
			const doc = await db.documents.orderBy('id').first();
			if (!doc || !doc.id) return;
			currentDocument.set(doc);
			currentId.set(doc.id);
			await db.set('currentId', doc.id);

			editor.commands.clearContent();
			editor.commands.setContent(get(currentDocument).html);
		} else {
			const id = get(currentId);
			await db.documents.update(id, placeholderDocument);
			currentDocument.update((d) => ({ ...d, ...placeholderDocument }));
			editor.commands.clearContent();
			editor.commands.setContent(get(currentDocument).html);
		}

		contents.set(await fileStore.getContents());
	},

	/**
	 * Creates a new document.
	 */
	newDocument: async () => {
		console.log('new document');
		await fileStore.saveDocument();
		const editor = get(storeEditor);

		if (browser && editor) {
			const newId = await db.documents.add({ ...placeholderDocument });
			const doc = await db.documents.get(newId);
			if (!doc || !doc.id) return;

			await db.set('currentId', newId);

			//set store
			currentDocument.set(doc);
			currentId.set(newId);
		}
		contents.set(await fileStore.getContents());
	},

	/**
	 * Switches to a different document by ID.
	 * @param {number} id The ID of the document to switch to.
	 */
	switchDoc: async (id: number) => {
		console.log('switching document');
		await fileStore.saveDocument();
		const editor = get(storeEditor);

		if (browser && editor) {
			const newDocument = await db.documents.get(id);
			if (!newDocument || !newDocument.id) return;

			currentDocument.set(newDocument);
			currentId.set(newDocument.id);

			await db.set('currentId', newDocument.id);
			editor.commands.clearContent();
			editor.commands.setContent(get(currentDocument).html);
		}
	}
};

export const currentId = writable<number>(await fileStore.getCurrentId());
export const currentDocument = writable<Document>(await fileStore.getCurrentDocument());
export const contents = writable<{ id: number; title: string; icon: string }[]>(await fileStore.getContents());
