<script lang="ts">
	import BubbleMenuExtension from '@tiptap/extension-bubble-menu';

	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { extensions } from '$lib/extensions';
	import { PluginKey } from '@tiptap/pm/state';

	import { editor } from '$lib/stores/editor';
	import { content, fileStore } from '$lib/stores/file';
	import { saveToast } from '$lib/stores/toast';
	import { handlePaste } from '$lib/handlers';

	import { updateDecorations } from '$lib/extensions/hoverButtons/hoverButtons';
	import { BubbleMenu } from '$components/menus';
	import ImageResizer from '$components/ImageResizer.svelte';

	let editorContainer: HTMLDivElement;
	let bubbleMenuContainer: HTMLDivElement;
	let bubbleMenuShowing = false;

	let saveTimeout: ReturnType<typeof setTimeout> | null = null; // inactivity timer

	onMount(async () => {
		await fileStore.syncLocalStorage();

		let newEditor = new Editor({
			element: editorContainer,
			content: $content,
			extensions: [
				//all extensions
				...extensions,

				//menu extensions that require editor context
				BubbleMenuExtension.configure({
					pluginKey: new PluginKey('TextMenu'),
					element: bubbleMenuContainer,
					shouldShow: ({ editor }) => {
						// don't show if image is selected
						if (editor.isActive('image')) {
							return false;
						}
						return editor.view.state.selection.content().size > 0;
					},
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
			editorProps: {
				handlePaste: handlePaste
			},
			onTransaction: () => {
				editor.set($editor);
			},
			onUpdate: () => {
				//clear the save timeout if it exists
				if (saveTimeout) {
					clearTimeout(saveTimeout);
					saveTimeout = null;
					saveToast.set('not saved');
				}

				//on update set a timer for 1.5s and save when complete
				saveTimeout = setTimeout(async () => {
					await fileStore.saveDocument();
				}, 1500);

				updateDecorations($editor);
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

<div bind:this={editorContainer} style="width: 100%" />
{#if $editor.isActive('image')}
	<ImageResizer />
{/if}

<div class="h-64 w-full bg-white" />
