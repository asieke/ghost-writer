<script lang="ts">
	import '$styles/app.css';
	import { Main, Sidebar, Toast, Nav } from '$components/layout';
	import { sidebarShowing } from '$lib/stores/layout';
	import { Menu } from 'lucide-svelte';
</script>

<div class="fixed left-0 top-0 z-50">
	<button class="px-2 py-3 text-slate-600" on:click={() => sidebarShowing.set(!$sidebarShowing)}><Menu /></button>
</div>
<div class="fixed left-0 right-0 top-0 h-[48px]">
	<Nav />
</div>
<div
	class="fixed bottom-0 left-0 top-0 w-[240px] overflow-y-auto bg-slate-100 transition-all duration-500 ease-in-out
  {$sidebarShowing ? 'translate-x-0' : '-translate-x-[240px]'}"
>
	<Sidebar />
</div>
<div
	class="fixed top-12 h-screen overflow-y-auto transition-all duration-500 ease-in-out
  {$sidebarShowing ? 'left-[240px] w-[calc(100vw-240px)]' : 'left-[0px] w-[100vw]'}"
>
	<Main>
		<slot />
	</Main>
</div>
<Toast />
