<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { extensions } from '$lib/extensions';

	import { editor } from '$lib/stores/editor';
	import { currentId, nextId, content, documents, fileStore } from '$lib/stores/file';

	let editorContainer: HTMLDivElement;

	onMount(async () => {
		await fileStore.syncLocalStorage();

		console.log($currentId, $nextId, $content, $documents);

		let newEditor = new Editor({
			element: editorContainer,
			content: $content,
			extensions,
			onTransaction: () => {
				editor.set($editor);
			}
		});

		editor.set(newEditor);
	});
</script>

<div bind:this={editorContainer} />

<div class="h-64 w-full bg-white" />
