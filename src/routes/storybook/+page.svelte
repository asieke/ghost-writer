<script lang="ts">
	import { sidebarShowing } from '$lib/stores/layout';
	import { Menu } from 'lucide-svelte';
</script>

<div class="fixed left-0 top-0 z-50">
	<button class="p-2 text-slate-600" on:click={() => sidebarShowing.set(!$sidebarShowing)}><Menu /></button>
</div>
<div class="fixed left-0 right-0 top-0 h-[48px] bg-red-500"></div>
<div
	class="fixed left-0 top-0 h-screen w-[240px] overflow-y-auto bg-blue-500 transition-all duration-500 ease-in-out
  {$sidebarShowing ? 'translate-x-0' : '-translate-x-[240px]'}"
></div>
<div
	class="fixed top-12 h-screen overflow-y-auto bg-green-500 transition-all duration-500 ease-in-out
  {$sidebarShowing ? 'left-[240px] w-[calc(100vw-240px)]' : 'left-[0px] w-[100vw]'}"
></div>
