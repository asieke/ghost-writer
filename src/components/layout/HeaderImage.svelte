<script lang="ts">
	import { showImageMenu } from '$lib/extensions/image/image';
	import { documents, currentId, fileStore } from '$lib/stores/file';
	import { onDestroy } from 'svelte';
	$: url = $documents.find((doc) => doc.id === $currentId)?.imgUrl;

	onDestroy(() => {
		console.log('destroying component');
	});

	let image: HTMLImageElement;
	let container: HTMLDivElement;

	let startY = 0;

	let maxScroll = 0;
	let offsetY = -100;

	let dragging = false;

	console.log(offsetY);

	const handleDrag = (e: MouseEvent) => {
		if (dragging === false) return;
		if (offsetY + e.clientY - startY > 0) return;
		if (offsetY + e.clientY - startY < -maxScroll) return;

		image.style.objectPosition = `0px ${offsetY + e.clientY - startY}px`;
	};

	const handleDragStart = (e: MouseEvent) => {
		dragging = true;
		const img = new Image();

		console.log('dragging >>> start');
		console.log('image position: ', image.style);

		maxScroll = image.height - container.clientHeight;
		console.log(maxScroll);

		startY = e.clientY;

		console.log('image: ', image.width, image.height);
		console.log('container: ', container.clientWidth, container.clientHeight);
	};

	const handleDragEnd = (e: MouseEvent) => {
		dragging = false;
		if (offsetY + e.clientY - startY > 0) {
			offsetY = 0;
		} else if (offsetY + e.clientY - startY < -maxScroll) {
			offsetY = -maxScroll;
		} else {
			offsetY = offsetY + e.clientY - startY;
		}

		console.log('dragging >>> done');
	};

	const bodyClick = (e: MouseEvent) => {
		if (e.target !== image) {
			image.style.cursor = 'default';
			image.removeEventListener('mousemove', handleDrag);
			image.removeEventListener('mousedown', handleDragStart);
			image.removeEventListener('mouseup', handleDragEnd);
			image.removeEventListener('drag', (e) => e.preventDefault());
			image.removeEventListener('dragstart', (e) => e.preventDefault());
			document.body.removeEventListener('mousedown', bodyClick);
		}
	};

	const activateReposition = () => {
		image.style.cursor = 'move';
		image.addEventListener('mousemove', handleDrag);
		image.addEventListener('mousedown', handleDragStart);
		image.addEventListener('mouseup', handleDragEnd);
		image.addEventListener('drag', (e) => e.preventDefault());
		image.addEventListener('dragstart', (e) => e.preventDefault());
		document.body.addEventListener('mousedown', bodyClick);
	};
</script>

<div class="banner h-[300px] overflow-clip" style="width: 100% height: 500px; relative" bind:this={container}>
	<button class="absolute" on:click={(e) => showImageMenu(null, fileStore.setImgUrl)}>Change Image</button>
	<button class="absolute top-8" on:click|stopPropagation={activateReposition}>Reposition</button>
	{#if url}<img
			bind:this={image}
			src={url}
			alt=""
			style="object-fit: cover; object-position: 0px {offsetY}px"
			draggable="true"
		/>{/if}
</div>

<style lang="postcss">
	.banner:hover button {
		@apply opacity-100;
	}

	.banner button:hover {
		@apply bg-slate-300;
	}

	.banner button {
		@apply m-3 rounded bg-slate-100 p-1 text-xs text-slate-600 opacity-0 transition-opacity duration-500 ease-in-out;
	}
</style>
