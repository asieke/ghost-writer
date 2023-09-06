export interface Metadata {
	title: string;
	imgUrl: string;
	imgOffset: number;
	lastUpdated: Date;
	icon: string;
}

export interface Document {
	id?: number;
	created_at?: Date;
	html: string;
	title: string;
	imgUrl: string;
	imgOffset: number;
	lastUpdated: Date;
	icon: string;
}
