<script lang="ts">
	import { sidebarShowing } from '$lib/stores/layout';
	import { Menu } from 'lucide-svelte';

	const url =
		'https://images.unsplash.com/photo-1542044801-30d3e45ae49a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';
</script>

<div class="h-48 w-full bg-cover bg-center" style="background: url({url})">Header</div>
<div id="editorContainer" class="px-16 py-8">
	<slot />
</div>
