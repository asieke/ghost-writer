<script lang="ts">
	import { toasts, removeToast, saveToast } from '$lib/stores/toast';
</script>

{#each $toasts as { message, id, status }, i}
	<div
		class="absolute right-8 h-[80px] w-64 animate-fadeIn rounded-lg border-[1px] border-slate-200 p-0 text-xs shadow-lg"
		style="bottom: {i * 100 + 32}px;"
	>
		<button class="h-full w-full p-4 text-left text-slate-700" on:click={() => removeToast(id)}>
			{message}
		</button>
	</div>
{/each}

{#if $saveToast === 'saved'}
	<div class=" absolute right-4 top-4 rounded-md bg-slate-100 p-1 text-xs text-slate-500 shadow-sm">
		{$saveToast}
	</div>
{:else if $saveToast === 'saving...'}
	<div class=" animate-pulse-fast absolute right-4 top-4 rounded-md bg-slate-100 p-1 text-xs text-slate-500 shadow-sm">
		{$saveToast}
	</div>
{:else}
	<div class=" absolute right-4 top-4 rounded-md bg-slate-100 p-1 text-xs text-slate-500 shadow-sm">
		{$saveToast}
	</div>
{/if}
