/* Store for saving files to local storage */

import { writable, get } from 'svelte/store';
import localforage from 'localforage';
import { browser } from '$app/environment';
import { editor as storeEditor } from './editor';
import { addToast } from './toast';

const PLACEHOLDER = {
	html: '<h1>My New Document</h1><p>Write something magical...</p>',
	title: 'My New Document'
};

//the ID of the document that is currently being edited
export const currentId = writable(0);
//the next primary key for a new document
export const nextId = writable(1);
//the contents of the document that is currently being edited
export const content = writable('');
//metadata about all of the documents
export const documents = writable<{ id: number; title: string }[]>([]);

export const fileStore = {
	//Initialize the stores variables by reading from local storage
	syncLocalStorage: async () => {
		currentId.set(((await localforage.getItem('currentId')) || 0) as number);
		localforage.setItem('currentId', get(currentId));

		nextId.set(((await localforage.getItem('nextId')) || 1) as number);
		localforage.setItem('nextId', get(nextId));

		documents.set(
			JSON.parse((await localforage.getItem('documents')) || JSON.stringify([{ id: 0, title: PLACEHOLDER.title }]))
		);
		localforage.setItem('documents', JSON.stringify(get(documents)));
		const localContent = (await localforage.getItem(get(currentId).toString())) as string;
		content.set(localContent || PLACEHOLDER.html);
		if (!localContent) {
			localforage.setItem(get(currentId).toString(), PLACEHOLDER.html);
		}
	},

	//save the current document to local storage
	saveDocument: async () => {
		const editor = get(storeEditor);

		if (browser && editor) {
			const html = editor.getHTML();
			//extract the title from the html
			const match = html.match(/<[^>]+>([^<]+)<\/[^>]+>/);
			const title = match ? match[1] : '';

			const currentIdValue = get(currentId);
			const documentsValue = get(documents);

			//update the document store

			const updatedDocuments = documentsValue.map((d) => (d.id === currentIdValue ? { id: d.id, title } : d));
			documents.set(updatedDocuments);
			localforage.setItem('documents', JSON.stringify(updatedDocuments));
			localforage.setItem(currentIdValue.toString(), html);

			addToast(title + ' saved successfully', 'success');
		}
	},

	deleteDocument: async () => {
		const documentsValue = get(documents);
		const currentIdValue = get(currentId);
		const editor = get(storeEditor);

		if (documentsValue.length === 1) {
			editor.commands.clearContent();
			editor.commands.setContent(PLACEHOLDER.html);
			await fileStore.saveDocument();
		} else {
			//find the array index of the current document
			const arrayIndex = documentsValue.findIndex((d) => d.id === currentIdValue);
			// find the index of the document to switch to
			let newIndex = arrayIndex;
			if (documentsValue[arrayIndex - 1]) newIndex--;
			else if (documentsValue[arrayIndex + 1]) newIndex++;

			// update the document store
			const newDocuments = documentsValue.filter((d) => d.id !== currentIdValue);
			const newId = documentsValue[newIndex].id;
			const content = (await localforage.getItem(newId.toString())) as string;

			// update local storage
			await localforage.setItem('documents', JSON.stringify(newDocuments));
			await localforage.setItem('currentId', newId);
			await localforage.removeItem(currentIdValue.toString());

			//update the editor
			documents.set(newDocuments);
			currentId.set(newId);
			editor.commands.clearContent();
			editor.commands.setContent(content);
		}
	},

	newDocument: async () => {
		await fileStore.saveDocument();
		const editor = get(storeEditor);
		if (browser && editor) {
			await localforage.setItem('currentId', get(nextId));
			await localforage.setItem('nextId', get(nextId) + 1);
			currentId.set(get(nextId));
			nextId.set(get(nextId) + 1);

			await localforage.setItem(get(currentId).toString(), PLACEHOLDER.html);
			const updatedDocuments = [...get(documents), { id: get(currentId), title: PLACEHOLDER.title }];
			documents.set(updatedDocuments);

			editor.commands.clearContent();
			editor.commands.setContent(PLACEHOLDER.html);
		}
	},

	switchDoc: async (id: number) => {
		const editor = get(storeEditor);
		if (browser && editor) {
			await fileStore.saveDocument();
			await localforage.setItem('currentId', id);
			currentId.set(id);
			content.set((await localforage.getItem(get(currentId).toString())) || '');
			editor.commands.clearContent();
			editor.commands.setContent(get(content));
		}
	}
};
