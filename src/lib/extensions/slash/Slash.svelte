<!-- Slash.svelte - component to display slash menu -->
<svelte:options accessors={true} />

<script lang="ts">
	import type { Editor, Range } from '@tiptap/core';
	import type { Item } from './slash';

	export let editor: Editor;
	export let range: Range;
	export let items: Item[];

	let selectedIndex = 0;
	let elements: HTMLButtonElement[] = [];
	$: {
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
			selectedIndex = (selectedIndex + items.length - 1) % items.length;
			return true;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % items.length;
			return true;
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
	<div class="border bg-white shadow-xl w-48 min-h-96 max-w-full rounded-lg overflow-scroll z-50">
		<div class="w-full">
			{#each items as { title, icon, command }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<button
					class="text-gray-900 w-full h-12 text-left select-none p-4 text-sm cursor-pointer {i == selectedIndex
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
						<svelte:component this={icon} class="w-4 h-4 mt-[2px] mr-2" />
						<span>{title}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}
