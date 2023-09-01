<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { TextMenu, ColorMenu, TextMarks, AlignMenu, AIMenu } from '$components/menus';
	import { Highlighter, PaintBucket, Type } from 'lucide-svelte';

	export let editor: Editor;

	//Text Color Menu
	const tAction = (c: string) => editor.chain().focus().setColor(c).run();
	const tUnset = () => editor.chain().focus().unsetColor().run();
	const tActive = (c: string) => editor.isActive('textStyle', { color: c });

	//Highlight Color Menu
	const hAction = (c: string) => editor.chain().focus().toggleHighlight({ color: c }).run();
	const hUnset = () => editor.chain().focus().unsetHighlight().run();
	const hActive = (c: string) => editor.isActive('highlight', { color: c });

	//Fill Color Menu
	const fAction = (c: string) => editor.chain().focus().setCellAttribute('backgroundColor', c).run();
	const fUnset = () => editor.chain().focus().setCellAttribute('backgroundColor', null).run();
	const fActive = (c: string) => editor.isActive('tableCell', { backgroundColor: c });
</script>

<div
	class="flex h-10 flex-row items-center divide-x divide-stone-200 rounded border border-stone-200 bg-white align-middle shadow-xl ring-1 ring-slate-300"
>
	<AIMenu {editor} />
	<TextMenu {editor} />
	<!-- Text Color Menu -->
	<ColorMenu {editor} action={tAction} unset={tUnset} icon={Type} active={tActive} />
	<!-- Fill Menu -->
	<ColorMenu {editor} action={fAction} unset={fUnset} icon={PaintBucket} active={fActive} />
	<!-- Highlight Menu -->
	<ColorMenu {editor} action={hAction} unset={hUnset} icon={Highlighter} active={hActive} />

	<!-- Text Marks -->
	<TextMarks {editor} />

	<!-- Align Menu -->
	<AlignMenu {editor} />
</div>
