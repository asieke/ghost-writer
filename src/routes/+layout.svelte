<script lang="ts">
	import '$styles/app.css';
	import { Main, Sidebar, Toast } from '$components/layout';
</script>

<div class="flex flex-row">
	<Sidebar />
	<Main>
		<slot />
	</Main>
	<Toast />
</div>
