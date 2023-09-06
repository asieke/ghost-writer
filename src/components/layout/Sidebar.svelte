<script lang="ts">
	import { fileStore, contents, currentId } from '$lib/stores/file';
	import { ArrowLeftToLine, Save, Trash2, FilePlus } from 'lucide-svelte';
	import { editor } from '$lib/stores/editor';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/clients/dexie';

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
		{#if $contents}
			{#each $contents as { id, title, icon }}
				<button class="doc" on:click={() => fileStore.switchDoc(id)}>
					<div class="{id === $currentId ? 'selected' : 'unselected'} flex flex-row items-center align-middle">
						<div class="mr-1 h-[18px] w-[18px]">{@html icon}</div>
						{title}
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
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
