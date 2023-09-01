<script lang="ts">
	import BubbleMenuExtension from '@tiptap/extension-bubble-menu';

	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { extensions } from '$lib/extensions';
	import { PluginKey } from '@tiptap/pm/state';

	import { editor } from '$lib/stores/editor';
	import { content, fileStore } from '$lib/stores/file';
	import { saveToast } from '$lib/stores/toast';

	import { BubbleMenu } from '$components/menus';

	let editorContainer: HTMLDivElement;
	let bubbleMenuContainer: HTMLDivElement;
	let bubbleMenuShowing = false;

	let saveTimeout: ReturnType<typeof setTimeout> | null = null; // inactivity timer

	onMount(async () => {
		await fileStore.syncLocalStorage();

		let newEditor = new Editor({
			element: editorContainer,
			content: JSON.parse($content),
			extensions: [
				//all extensions
				...extensions,

				//menu extensions that require editor context
				BubbleMenuExtension.configure({
					pluginKey: new PluginKey('TextMenu'),
					element: bubbleMenuContainer,
					tippyOptions: {
						moveTransition: 'transform 0.3s ease-out',
						maxWidth: 450,
						onShow: (instance) => {
							bubbleMenuShowing = true;
						},
						onHide() {
							bubbleMenuShowing = false;
						}
					}
				})
			],
			onTransaction: () => {
				editor.set($editor);
			},
			onUpdate: () => {
				// on update start a timer for 1.5s
				// save if its been 1.5s since the last update
				if (saveTimeout) {
					clearTimeout(saveTimeout);
					saveTimeout = null;
					saveToast.set('not saved');
				}
				saveTimeout = setTimeout(async () => {
					await fileStore.saveDocument();
				}, 1500);
			}
		});

		editor.set(newEditor);
	});
</script>

<div bind:this={bubbleMenuContainer}>
	{#if $editor && bubbleMenuShowing}
		<BubbleMenu editor={$editor} />
	{/if}
</div>
<div bind:this={editorContainer} />

<div class="h-64 w-full bg-white" />
