<script lang="ts">
	import { showImageMenu } from '$lib/extensions/image/image';
	import { fileStore, currentDocument } from '$lib/stores/file';

	$: url = $currentDocument.imgUrl;
	$: offsetY = $currentDocument.imgOffset;
	$: icon = $currentDocument.icon;
	$: lastUpdated = $currentDocument.lastUpdated;

	let image: HTMLImageElement;
	let container: HTMLDivElement;

	let startY = 0;

	let maxScroll = 0;

	let dragging = false;

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

		fileStore.updateDocument({ imgOffset: offsetY });
	};

	const bodyClick = (e: MouseEvent) => {
		if (e.target !== image) {
			image.style.cursor = 'default';
			image.removeEventListener('mousedown', handleDragStart);
			image.removeEventListener('drag', (e) => e.preventDefault());
			image.removeEventListener('dragstart', (e) => e.preventDefault());
			document.removeEventListener('mousemove', handleDrag);
			document.body.removeEventListener('mouseup', handleDragEnd);
			document.body.removeEventListener('mousedown', bodyClick);
		}
	};

	const activateReposition = () => {
		image.style.cursor = 'move';
		image.addEventListener('mousedown', handleDragStart);
		image.addEventListener('drag', (e) => e.preventDefault());
		image.addEventListener('dragstart', (e) => e.preventDefault());
		document.addEventListener('mousemove', handleDrag);
		document.body.addEventListener('mouseup', handleDragEnd);
		document.body.addEventListener('mousedown', bodyClick);
	};

	const handleBackgroundImage = (url: string) => {
		fileStore.updateDocument({ imgUrl: url });
	};

	const handleIconImage = (url: string) => {
		if (url.length <= 2) {
			fileStore.updateDocument({ icon: '<span>' + url + '</span>' });
		} else {
			fileStore.updateDocument({ icon: `<img src=${url} />` });
		}
	};
</script>

<button class="iconWrapper absolute left-14 top-[252px] z-50" on:click={(e) => showImageMenu(null, handleIconImage)}>
	{@html icon}
</button>

<div class="banner relative overflow-clip bg-red-500" style="width: 100%; height: 300px;" bind:this={container}>
	<button class="absolute" on:click={(e) => showImageMenu(null, handleBackgroundImage)}>Change Image</button>
	<button class="absolute top-8" on:click|stopPropagation={activateReposition}>Reposition</button>
	{#if url}
		<img
			bind:this={image}
			src={url}
			alt=""
			style="width: 100%; object-fit: cover; object-position: 0px {offsetY}px"
			draggable="true"
		/>
	{/if}
	<div class="absolute bottom-0 right-0 bg-red-500">{lastUpdated}</div>
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
