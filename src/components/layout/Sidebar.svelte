<script lang="ts">
	import { sidebarShowing } from '$lib/stores/layout';
	import { fileStore, documents, currentId } from '$lib/stores/file';
	import { ArrowLeftToLine, Save, Trash2, FilePlus } from 'lucide-svelte';

	let container: HTMLDivElement;

	const doAction = (e: Event, action: () => Promise<void>) => {
		const button = e.currentTarget as HTMLButtonElement;
		const currentBg = button.style.backgroundColor;
		button.disabled = true;
		button.classList.add('animate-pulse');
		action().then(() => {
			container.scrollTop = container.scrollHeight;
			button.classList.remove('animate-pulse', 'transition', 'duration-500', 'ease-in-out');
			button.style.backgroundColor = 'var(--success)';
			setTimeout(() => {
				button.classList.add('transition', 'duration-500', 'ease-in-out');
				button.style.backgroundColor = currentBg;
				button.disabled = false;
			}, 1000);
		});
	};
</script>

<!-- Sidebar Open = translate left 240px-->

<!-- Open the Sidebar -->
<button
	class="z-50 absolute left-[195px] top-0 p-2 pr-3 pt-3 transition-all duration-500 ease-in-out {$sidebarShowing
		? '-translate-x-0'
		: '-translate-x-[240px]'}"
	on:click={() => sidebarShowing.set(false)}
>
	<ArrowLeftToLine class="w-6 h-6 text-slate-500" />
</button>

<div
	bind:this={container}
	class="z-40 h-screen overflow-y-auto relative w-[240px] bg-slate-100 text-slate-700 text-sm transition-all duration-500 ease-in-out overflow-clip flex-shrink-0 {$sidebarShowing
		? '-translate-x-0'
		: '-translate-x-[240px]'}"
>
	<!-- Sidebar Content -->
	<div class="h-full w-full pt-16 px-6 flex flex-col">
		{#each $documents as { title, id }}
			<button class="doc" on:click={() => fileStore.switchDoc(id)}>
				<div class={id === $currentId ? 'selected' : 'unselected'}>
					{title}
				</div>
			</button>
		{/each}

		<div class="flex flex-row justify-evenly mt-8 pb-12">
			<button class="action" on:click={(e) => doAction(e, fileStore.saveDocument)}><Save class="w-5 h-5" /></button>
			<button class="action" on:click={(e) => doAction(e, fileStore.deleteDocument)}><Trash2 class="w-5 h-5" /></button>
			<button class="action" on:click={(e) => doAction(e, fileStore.newDocument)}><FilePlus class="w-5 h-5" /></button>
		</div>
	</div>
</div>

<style lang="postcss">
	button.action {
		@apply p-2 bg-slate-200 rounded-md hover:bg-slate-300;
	}

	button.doc {
		@apply text-left py-2;
	}

	.selected,
	.doc:hover .unselected {
		@apply border-l-4 border-slate-500 p-0.5 pl-2;
	}
	.unselected {
		@apply border-l-4 border-slate-100 p-0.5 pl-2;
	}
</style>
