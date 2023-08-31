<script lang="ts">
	import { sidebarShowing } from '$lib/stores/layout';
	import { Menu } from 'lucide-svelte';
</script>

<!-- Button to open sidebar -->

<button
	class="z-30 absolute left-0 top-0 pt-3 pl-3 p-2 transition-all duration-500 ease-in-out"
	on:click={() => sidebarShowing.set(true)}
>
	<Menu class="w-6 h-6 text-slate-500" />
</button>

<!-- Editor Container, expands if sidebar is not showing-->

<div
	id="editorContainer"
	class="relative h-screen overflow-y-auto py-8 px-16 transition-all duration-500 ease-in-out {$sidebarShowing
		? 'w-[calc(100vw-240px)] translate-x-0'
		: 'w-[100vw] -translate-x-[240px]'}"
>
	<slot />
</div>
