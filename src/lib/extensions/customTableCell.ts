import TableCell from '@tiptap/extension-table-cell';

export const CustomTableCell = TableCell.extend({
	addKeyboardShortcuts() {
		return {
			// ↓ your new keyboard shortcut
			'Mod-Alt-]': () => this.editor.commands.addColumnAfter(),
			'Mod-Alt-[': () => this.editor.commands.addColumnBefore(),
			'Mod-Alt-\\': () => this.editor.commands.deleteColumn(),
			'Mod-Alt-,': () => this.editor.commands.addRowBefore(),
			'Mod-Alt-.': () => this.editor.commands.addRowAfter(),
			'Mod-Alt-/': () => this.editor.commands.deleteRow()
		};
	},
	addAttributes() {
		return {
			// extend the existing attributes …
			...this.parent?.(),

			// and add a new one …
			backgroundColor: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-background-color'),
				renderHTML: (attributes) => {
					return {
						'data-background-color': attributes.backgroundColor,
						style: `background-color: ${attributes.backgroundColor}`
					};
				}
			}
		};
	}
});
