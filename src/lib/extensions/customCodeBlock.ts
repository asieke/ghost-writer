import CodeBlock from '@tiptap/extension-code-block-lowlight';

export const CustomCodeBlock = CodeBlock.extend({
	addKeyboardShortcuts() {
		return {
			// ↓ your new keyboard shortcut
			Tab: () => {
				if (this.editor.state.selection.$from.node(1).type.name === 'codeBlock')
					return this.editor.chain().focus().insertContent('  ').run();
				else {
					return false;
				}
			}
		};
	}
});
