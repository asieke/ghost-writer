<script>
	import { currentDocument, fileStore } from '$lib/stores/file';
	import { editor } from '$lib/stores/editor';
	import { sidebarShowing } from '$lib/stores/layout';
	import { Trash2, FilePlus, CopyPlus } from 'lucide-svelte';
	import { generateHTML } from '$lib/generateHTML';
	import { addToast } from '$lib/stores/toast';

	const deleteDocument = async () => {
		if (confirm('Are you sure you want to delete this document?')) {
			await fileStore.deleteDocument();
		}
	};

	const copyHTML = async () => {
		try {
			const input = $editor.getHTML(); // Make sure this function works as expected
			const html = generateHTML(input); // Make sure this function works as expected

			const clipboardItem = new ClipboardItem({
				'text/html': new Blob([html], { type: 'text/html' }),
				'text/plain': new Blob([html], { type: 'text/plain' })
			});
			navigator.clipboard.write([clipboardItem]).then(
				(_) => console.log('clipboard.write() Ok'),
				(error) => alert(error)
			);
		} catch (err) {
			console.error('Error:', err);
		}
	};

	const changeFont = () => {
		document.documentElement.classList.toggle('Times');
	};
</script>

<div
	class="flex h-full w-full flex-row items-center justify-between bg-slate-50 align-middle transition-all duration-500 ease-in-out"
	style={$sidebarShowing ? 'padding-left: 254px' : 'padding-left: 50px'}
>
	<div><button on:click={changeFont} class="rounded bg-indigo-300 p-1 px-2 text-white shadow-sm">Font</button></div>
	<div class="flex flex-row space-x-2 pr-4 text-slate-500">
		<button class="action" on:click={deleteDocument}><Trash2 /></button>
		<button class="action" on:click={fileStore.newDocument}><FilePlus /></button>
		<button class="action" on:click={copyHTML}><CopyPlus /></button>
	</div>
</div>

<style lang="postcss">
	button {
		@apply text-slate-500 hover:text-indigo-600;
	}
</style>
