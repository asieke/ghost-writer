// db.ts
import Dexie, { type Table } from 'dexie';
import type { Document } from '$types/database';

export const placeholderDocument: Document = {
	html: '<h1>hello world</h1>',
	title: 'hello world',
	imgUrl: 'https://www.notion.so/images/page-cover/webb1.jpg',
	imgOffset: 0,
	lastUpdated: new Date(),
	icon: '<span>📄</span>'
};

export class MySubClassedDexie extends Dexie {
	// 'friends' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	documents!: Table<Document>;

	kvStore!: Table<{ key: string; value: unknown }>;

	constructor() {
		super('myDocuments');
		this.version(1).stores({
			documents: '++id, created_at',
			kvStore: 'key'
		});

		// Add hook to populate created_at field
		this.documents.hook('creating', function (primKey, obj: Document) {
			console.log('creating, ', primKey);
			obj.created_at = new Date();
			obj.lastUpdated = new Date();
		});

		//Add a hook to populare the lastUpdated field
		this.documents.hook('updating', function (mods: Partial<Document>) {
			console.log('running dexie update hook');
			mods.lastUpdated = new Date();
			return mods;
		});

		this.on('populate', async () => {
			const temp = await this.documents.add(placeholderDocument);
			await this.set('currentId', temp);
		});
	}

	async set(key: string, value: unknown) {
		await this.kvStore.put({ key, value });
	}

	async get(key: string) {
		const record = await this.kvStore.get(key);
		return record ? record.value : null;
	}

	async remove(key: string) {
		await this.kvStore.delete(key);
	}
}

export const db = new MySubClassedDexie();
