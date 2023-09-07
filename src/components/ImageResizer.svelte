<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { editor } from '$lib/stores/editor';

	// import interact from 'interactjs';

	let image: HTMLImageElement;
	// let interactInstance: ReturnType<typeof interact>;

	let resizing = false;
	let offset = 0;
	let initialClientX = 0;
	let initialSize = 0;

	//if the mouse is within 20 of the east or west edge, the show resizer
	const handleImageMouseMove = (e: MouseEvent) => {
		if (e.offsetX > image.width - 20) {
			image.style.cursor = 'ew-resize';
		} else {
			image.style.cursor = 'all-scroll';
		}
	};

	const handleImageDragstart = (e: DragEvent) => {
		if (e.offsetX > image.width - 20) {
			e.preventDefault();
			resizing = true;
			console.log('initial client x', e.clientX);
			initialClientX = e.clientX;
			initialSize = image.width;
			offset = image.width - e.offsetX;
			return false;
		}
	};

	const handleMouseUp = (e: MouseEvent) => {
		if (resizing === true) {
			resizing = false;
			//update the image in the editor
			setImage();
		}
	};

	const setImage = () => {
		const selection = $editor.state.selection;
		$editor.commands.setImage({
			src: image.src,
			// @ts-ignore
			width: image.width as number,
			height: image.height as number
		});
		$editor.commands.setNodeSelection(selection.from);
		initialize();
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (resizing === true) {
			image.width = initialSize + (e.clientX - initialClientX);
		}
	};

	const initialize = () => {
		image = document.querySelector('.ProseMirror-selectednode') as HTMLImageElement;
		if (!image) return;

		image.style.outline = '5px solid #7dd3fc';

		image.addEventListener('mousemove', handleImageMouseMove);
		image.addEventListener('dragstart', handleImageDragstart);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mousemove', handleMouseMove);
	};

	onMount(initialize);

	onDestroy(() => {
		if (image) {
			image.style.outline = '0px';
		}
		image.removeEventListener('mousemove', handleImageMouseMove);
		image.removeEventListener('dragstart', handleImageDragstart);
		window.removeEventListener('mouseup', handleMouseUp);
		window.removeEventListener('mousemove', handleMouseMove);
		console.log('DESTROY!!!!');
	});
</script>

<!-- const selection = $editor.state.selection;
$editor.commands.setImage({
	src: imageInfo.src,
	// @ts-ignore
	width: imageInfo.width as number,
	height: imageInfo.height as number
});
$editor.commands.setNodeSelection(selection.from); -->
