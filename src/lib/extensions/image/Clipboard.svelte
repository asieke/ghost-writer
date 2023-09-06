<script lang="ts">
	import axios from 'axios';
	import { onDestroy, onMount } from 'svelte';
	import type { Instance } from 'tippy.js';

	export let callback: (url: string) => void;
	export let instance: Instance;

	let imageSrc = ''; // This will hold the src attribute for the image
	let data: string = '';

	const handlePaste = async (e: ClipboardEvent) => {
		e.preventDefault();

		const clipboardData = e.clipboardData || (window as any).clipboardData;
		const items = clipboardData.items || clipboardData.files;
		for (const item of items) {
			if (item.type.indexOf('image') === 0) {
				const image = item.getAsFile() as Blob;

				const reader = new FileReader();
				reader.readAsDataURL(image);

				reader.onload = async (e) => {
					if (!e || !e.target) return;

					const result = e.target.result;
					const imgData = (result as string).split(',');
					data = imgData[1];
				};
			}
		}
	};

	const clearListeners = () => {
		window.removeEventListener('paste', handlePaste);
	};

	onMount(() => {
		window.addEventListener('paste', handlePaste);
	});

	const handleUpload = async () => {
		axios
			.post('/api/uploadImage', {
				data
			})
			.then((res) => {
				callback(res.data.filename);
				instance.destroy();
			});
	};
</script>

<div>
	<span>please paste an image with control-v</span>
	{#if data !== ''}
		<img src="data:image/png;base64,{data}" alt="pasted by user" />
		<button on:click|stopPropagation={handleUpload}>Update Image</button>
	{/if}
</div>

<style lang="postcss">
	button {
		@apply mt-4 rounded bg-slate-800 px-2 py-1 text-white;
	}
</style>
