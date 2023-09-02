import axios from 'axios';
import type { EditorView } from '@tiptap/pm/view';

export const handlePaste = (view: EditorView, event: ClipboardEvent) => {
	console.log('handling paste');

	const type = view.state.selection.$from.node(1).type.name;

	const items = Array.from(event.clipboardData?.items || []);
	for (const item of items) {
		if (item.type.indexOf('image') === 0) {
			// handle the image upload

			const image = item.getAsFile() as Blob;

			const reader = new FileReader();
			reader.readAsDataURL(image);

			reader.onload = async (e) => {
				if (!e || !e.target) return;

				const result = e.target.result;
				const data: { image: string | null } = { image: null };
				const imgData = (result as string).split(',');
				data.image = imgData[1];

				axios
					.post('/api/uploadImage', {
						data
					})
					.then((res) => {
						if (type === 'table') {
							const node = view.state.schema.nodes.image.create({ src: res.data.filename });
							const transaction = view.state.tr.replaceSelectionWith(node); // places it in the correct position
							view.dispatch(transaction);
						} else {
							console.log('pasting into doc');

							// $editor.chain().focus().setImage({ src: res.data.filename }).run();

							const imageNode = view.state.schema.nodes.image.create({ src: res.data.filename });
							// const cellNode = view.state.schema.nodes.tableCell.create(null, imageNode);
							// const rowNode = view.state.schema.nodes.tableRow.create(null, cellNode);
							// const tableNode = view.state.schema.nodes.table.create(null, rowNode);
							const transaction = view.state.tr.replaceSelectionWith(imageNode);
							view.dispatch(transaction);

							console.log('time to wrap it');
						}
					});

				console.log('ITS AN IMAGE!!!', view);
				return true; // handled
			};
		}
	}
	return false;
};
