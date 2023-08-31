<script lang="ts">
	import { toasts, removeToast } from '$lib/stores/toast';
</script>

{#each $toasts as { message, id, status }, i}
	<div
		class="animate-fadeIn absolute right-8 w-64 h-[80px] shadow-lg rounded-lg border-[1px] border-slate-200 p-0 text-xs"
		style="bottom: {i * 100 + 32}px;"
	>
		<button class="p-4 h-full w-full text-left text-slate-700" on:click={() => removeToast(id)}>
			{message}
		</button>
	</div>
{/each}
