import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { Editor } from '@tiptap/core';
import type { Node as ProseNode } from '@tiptap/pm/model';
import HoverMenu from './HoverMenu.svelte';
import tippy, { type Instance } from 'tippy.js';

let currentInstance: Instance | null = null;

export const updateDecorations = (editor: Editor) => {
	// create an empty DecorationSet
	let decorationSet = DecorationSet.empty;

	// iterate over each top-level node in the document
	editor.state.tr.doc.forEach((node, pos) => {
		// if it's a block node, create a widget Decoration

		const dom = document.createElement('button');
		dom.className = 'hoverButton';
		dom.id = pos.toString();
		dom.innerHTML =
			'<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grip"><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/><circle cx="5" cy="19" r="1"/></svg></div>';

		dom.addEventListener('click', (e: Event) => {
			(e.target as HTMLElement).blur();
			clickHandler(e, node, pos, editor);
		});

		// create an anchor widget Decoration at the current position
		const decoration = Decoration.widget(pos + 1, dom, { side: -1 }); // pos + 1 avoids replacing the node itself
		decorationSet = decorationSet.add(editor.state.tr.doc, [decoration]);
	});

	// Apply decorationSet to editor state through a transaction
	editor.view.setProps({
		decorations() {
			return decorationSet;
		}
	});
};

const clickHandler = (e: Event, node: ProseNode, pos: number, editor: Editor) => {
	const element = document.createElement('div');
	const component = new HoverMenu({
		target: element,
		props: {
			editor,
			node,
			pos,
			onDelete: killInstance
		}
	});

	function killInstance() {
		currentInstance?.destroy();
		currentInstance = null;
		component.$destroy();
	}

	if (currentInstance) {
		killInstance();
		return;
	}

	const target = e.currentTarget as HTMLElement;

	let inMenu = false;
	element.addEventListener('mouseleave', () => {
		inMenu = false;
		killInstance();
	});
	element.addEventListener('mouseenter', () => (inMenu = true));
	target.addEventListener('mouseleave', () => {
		if (!inMenu) killInstance();
	});

	currentInstance = tippy('body', {
		getReferenceClientRect: () => target.getBoundingClientRect(),
		appendTo: () => target,
		content: element,
		interactive: true,
		hideOnClick: false,
		trigger: 'click',
		placement: 'bottom-start'
	})[0];
};
