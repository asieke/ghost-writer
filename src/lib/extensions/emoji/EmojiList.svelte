<svelte:options accessors={true} />

<script lang="ts">
	import type { Editor, Range } from '@tiptap/core';

	export let editor: Editor;
	export let range: Range;
	export let items: {
		title: string;
		command: (params: { editor: Editor; range: Range }) => void;
	}[];

	let selectedIndex = 0;
	let elements: HTMLButtonElement[] = [];
	$: {
		selectedIndex = Math.min(items.length - 1, selectedIndex);
		if (elements[0] != null) {
			elements[selectedIndex]?.scrollIntoView({
				block: 'nearest',
				behavior: 'smooth'
			});
		}
	}
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = selectedIndex > 8 ? selectedIndex - 8 : selectedIndex;
			return true;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = selectedIndex < items.length - 8 ? selectedIndex + 8 : selectedIndex;
			return true;
		}

		if (e.key === 'ArrowRight') {
			e.preventDefault();
			selectedIndex = Math.min(items.length - 1, selectedIndex + 1);
			return true;
		}

		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			selectedIndex = Math.max(0, selectedIndex - 1);
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			const item = items[selectedIndex];

			if (item) {
				item.command({ editor, range });
			}
			return true;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if items.length > 0}
	<div
		class="inset-0 z-50 h-64 w-64 max-w-full overflow-scroll rounded-lg border-0 bg-white shadow-xl ring-1 ring-slate-200"
	>
		<div class="grid grid-cols-8">
			{#each items as { title, command }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<button
					class="-inset-0 flex h-8 w-8 cursor-pointer items-center justify-center border-0 align-middle text-xl ring-0 {i ==
					selectedIndex
						? 'bg-gray-100'
						: 'bg-white'}"
					id="listbox-option-0"
					on:mouseenter={() => (selectedIndex = i)}
					on:click={() => {
						command({ editor, range });
					}}
					bind:this={elements[i]}
				>
					<div class="flex flex-row">
						<span>{title}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}
