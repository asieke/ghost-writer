<script lang="ts">
	import { sidebarShowing } from '$lib/stores/layout';
	import { Menu } from 'lucide-svelte';
</script>

<!-- Button to open sidebar -->

<button
	class="absolute left-0 top-0 z-30 p-2 pl-3 pt-3 transition-all duration-500 ease-in-out"
	on:click={() => sidebarShowing.set(true)}
>
	<Menu class="h-6 w-6 text-slate-500" />
</button>

<!-- Editor Container, expands if sidebar is not showing-->

<div
	id="editorContainer"
	class="absolute left-[240px] top-0 h-screen overflow-y-auto px-16 py-8 transition-all duration-500 ease-in-out"
	style={$sidebarShowing ? 'width: calc(100vw - 240px)' : 'width: 100vw; transform: translateX(-240px);'}
>
	<slot />
</div>
