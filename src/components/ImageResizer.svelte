<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { editor } from '$lib/stores/editor';
	import interact from 'interactjs';

	let imageInfo: HTMLImageElement;
	let interactInstance: ReturnType<typeof interact>;

	const initialize = () => {
		imageInfo = document.querySelector('.ProseMirror-selectednode') as HTMLImageElement;
		if (!imageInfo) return;

		imageInfo.style.outline = '5px solid #7dd3fc';
		imageInfo.ondragstart = function () {
			return false;
		};

		interactInstance = interact(imageInfo).resizable({
			edges: { top: false, left: true, bottom: false, right: true },
			margin: 0,
			listeners: {
				move: function (event) {
					let width = event.rect.right - event.rect.left;
					imageInfo.width = width;
				},
				end: function (event) {
					const selection = $editor.state.selection;
					$editor.commands.setImage({
						src: imageInfo.src,
						// @ts-ignore
						width: imageInfo.width as number,
						height: imageInfo.height as number
					});
					$editor.commands.setNodeSelection(selection.from);
					initialize();
				}
			}
		});
	};

	onMount(initialize);
	onDestroy(() => {
		if (interactInstance) {
			interactInstance.unset();
		}
		if (imageInfo) {
			imageInfo.style.outline = '0px';
		}
	});
</script>
