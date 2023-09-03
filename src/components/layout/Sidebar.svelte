<script lang="ts">
	import { sidebarShowing } from '$lib/stores/layout';
	import { fileStore, documents, currentId } from '$lib/stores/file';
	import { ArrowLeftToLine, Save, Trash2, FilePlus } from 'lucide-svelte';
	import { editor } from '$lib/stores/editor';

	let container: HTMLDivElement;

	const doAction = (e: Event, action: () => Promise<void>) => {
		const button = e.currentTarget as HTMLButtonElement;
		const currentBg = button.style.backgroundColor;
		button.disabled = true;
		button.classList.add('animate-pulse');
		action().then(() => {
			container.scrollTop = container.scrollHeight;
			button.classList.remove('animate-pulse', 'transition', 'duration-500', 'ease-in-out');
			button.style.color = 'var(--success)';
			setTimeout(() => {
				button.classList.add('transition', 'duration-500', 'ease-in-out');
				button.style.color = currentBg;
				button.disabled = false;
			}, 1000);
		});
	};
</script>

<!-- Sidebar Open = translate left 240px-->

<div bind:this={container} class="text-sm text-slate-700">
	<!-- Sidebar Content -->
	<div class="flex h-full w-full flex-col px-6 pt-16">
		{#each $documents as { title, id }}
			<button class="doc" on:click={() => fileStore.switchDoc(id)}>
				<div class={id === $currentId ? 'selected' : 'unselected'}>
					{title}
				</div>
			</button>
		{/each}

		<div class="mt-8 flex flex-row justify-evenly pb-12">
			<button class="action" on:click={(e) => doAction(e, fileStore.deleteDocument)}><Trash2 class="h-5 w-5" /></button>
			<button class="action" on:click={(e) => doAction(e, fileStore.newDocument)}><FilePlus class="h-5 w-5" /></button>
			<button class="action" on:click={() => alert(JSON.stringify($editor.getJSON()))}>Copy</button>
		</div>
	</div>
</div>

<style lang="postcss">
	button.action {
		@apply rounded-md bg-slate-200 p-2 hover:bg-slate-300;
	}

	button.doc {
		@apply py-2 text-left;
	}

	.selected,
	.doc:hover .unselected {
		@apply border-l-4 border-slate-500 p-0.5 pl-2;
	}
	.unselected {
		@apply border-l-4 border-slate-100 p-0.5 pl-2;
	}
</style>
