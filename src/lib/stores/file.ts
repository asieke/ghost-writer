/* Store for saving files to local storage */

import { writable, get } from 'svelte/store';
import { getItem, setItem, removeItem } from '$lib/clients/localForage';
import { browser } from '$app/environment';
import { editor as storeEditor } from './editor';
import { saveToast } from '$lib/stores/toast';
import { generateRandomHash } from '$lib/utils';

const PLACEHOLDER = {
	html: '<h1>My New Document</h1><p>Lets write something magical</p>',
	title: 'My New Document',
	imgUrl: 'https://www.notion.so/images/page-cover/webb1.jpg'
};

type Document = {
	id: string;
	title: string;
	imgUrl: string;
};

//the ID of the document that is currently being edited
export const currentId = writable('');
//the contents of the document that is currently being edited
export const content = writable('');
//metadata about all of the documents
export const documents = writable<Document[]>([]);

export const fileStore = {
	//Initialize the stores variables by reading from local storage
	syncLocalStorage: async () => {
		const newId = generateRandomHash();
		const newDocuments: Document[] = [{ id: newId, title: PLACEHOLDER.title, imgUrl: PLACEHOLDER.imgUrl }];
		const newContent = PLACEHOLDER.html;

		currentId.set((await getItem('currentId')) || newId);
		setItem('currentId', get(currentId));

		content.set((await getItem(get(currentId))) || newContent);
		setItem(get(currentId), get(content));

		documents.set(((await getItem('documents')) as Document[]) || newDocuments);
		setItem('documents', get(documents));
	},

	setImgUrl: async (url: string) => {
		console.log('setting image url');
		const currentIdValue = get(currentId);
		const documentsValue = get(documents);
		const newDocuments = documentsValue.map((d) => (d.id === currentIdValue ? { ...d, imgUrl: url } : d));
		documents.set(newDocuments);
		setItem('documents', newDocuments);
	},

	//save the current document to local storage
	saveDocument: async () => {
		console.log('saving document');
		saveToast.set('saving...');
		const editor = get(storeEditor);

		if (browser && editor) {
			const html = editor.getHTML();
			//extract the title from the html
			const match = html.match(/<[^>]+>([^<]+)<\/[^>]+>/);
			const title = match ? match[1] : '';

			const currentIdValue = get(currentId);
			const documentsValue = get(documents);

			//update the document store

			const updatedDocuments = documentsValue.map((d) =>
				d.id === currentIdValue ? { id: d.id, title, imgUrl: d.imgUrl } : d
			);
			documents.set(updatedDocuments);
			setItem('documents', updatedDocuments);
			setItem(currentIdValue, html);
		}

		setTimeout(() => {
			saveToast.set('saved');
		}, 1000);
	},

	deleteDocument: async () => {
		console.log('deleting document');
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
			const content = await getItem<string>(newId);

			// update local storage
			await setItem('documents', newDocuments);
			await setItem('currentId', newId);
			await removeItem(currentIdValue);

			//update the editor
			documents.set(newDocuments);
			currentId.set(newId);
			editor.commands.clearContent();
			editor.commands.setContent(content);
		}
	},

	newDocument: async () => {
		console.log('new document');
		await fileStore.saveDocument();
		const editor = get(storeEditor);
		if (browser && editor) {
			// get a new ID
			const newId = generateRandomHash();
			await setItem('currentId', newId);
			currentId.set(newId);

			// get new Content
			await setItem(newId, PLACEHOLDER.html);
			content.set(PLACEHOLDER.html);

			// get the new Documents
			const updatedDocuments = [...get(documents), { id: newId, title: PLACEHOLDER.title, imgUrl: PLACEHOLDER.imgUrl }];
			documents.set(updatedDocuments);
			await setItem('documents', updatedDocuments);

			//update the editor
			editor.commands.clearContent();
			editor.commands.setContent(PLACEHOLDER.html);
		}
	},

	switchDoc: async (id: string) => {
		console.log('switching document');
		const editor = get(storeEditor);
		if (browser && editor) {
			await fileStore.saveDocument();
			await setItem('currentId', id);
			currentId.set(id);
			content.set((await getItem(get(currentId))) || '');
			editor.commands.clearContent();
			editor.commands.setContent(get(content));
		}
	}
};
