<svelte:options accessors={true} />

<script lang="ts">
	import { SendHorizontal } from 'lucide-svelte';
	import type { Editor, Range } from '@tiptap/core';
	import { onMount, tick } from 'svelte';
	import { Sparkles } from 'lucide-svelte';
	import { getStream, consumeString } from '$lib/clients/openAI';

	export let editor: Editor;
	export let range: Range;

	let menu: HTMLDivElement;
	let input: HTMLInputElement;
	let submit: HTMLButtonElement;
	let aiTextArea: HTMLTextAreaElement;
	let topCSS = '-top-[42px]';

	//state
	let inputText: string = '';
	let suggestionText = '';
	let loading = false;
	let focusedElement: 'input' | 'suggestion' | 'submit' = 'input';

	onMount(() => {
		console.log('mounting....');
		tick().then(() => {
			const width = editor.view.dom.getBoundingClientRect().width;
			//get the x position of the cursor in the editor
			const { left } = editor.view.coordsAtPos(range.from);

			console.log(left);

			if (input) input.focus();
			if (editor.isActive('heading')) {
				topCSS = '-top-[45px]';
			}
			if (editor.isActive('heading', { level: 1 })) {
				topCSS = '-top-[52px]';
			}
		});
	});

	const updateContentCallback = (s: string) => {
		suggestionText = suggestionText + s;
		if (aiTextArea) {
			aiTextArea.scrollTop = aiTextArea.scrollHeight;
		}
	};

	const getAIResponse = async () => {
		try {
			suggestionText = '';
			const response = await getStream({ content: inputText });
			await consumeString({ callback: updateContentCallback, response });
			submit.focus();
			console.log('done consuming string');
		} catch (error) {
			console.error(error);
		}
	};

	const insertAISuggestion = async () => {
		const temp = suggestionText;
		suggestionText = '';
		loading = false;
		editor.chain().focus().deleteRange(range).insertContent(temp).run();
	};

	async function handleKeydown(e: KeyboardEvent) {
		if (focusedElement === 'input' && e.key === 'Enter' && inputText.length > 3) {
			e.preventDefault();
			loading = true;
			console.log('time to send the query off...');
			await getAIResponse();
			loading = false;
		}

		if (
			loading === false &&
			(e.key === 'Escape' || ((e.key === 'Enter' || e.key === 'Backspace') && inputText.length === 0))
		) {
			e.preventDefault();
			console.log('escape pressed');
			editor.chain().focus().deleteRange(range).run();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="absolute {topCSS} z-50 overflow-scroll rounded-lg border bg-white p-2 shadow-xl"
	style="width: 600px"
	bind:this={menu}
>
	<div class="flex flex-row items-center align-middle">
		{#if loading}
			<div class="spinning flex h-6 w-6 items-center justify-center align-middle">
				<Sparkles class="h-5 w-5 text-indigo-600" />
			</div>
		{:else}
			<div class="flex h-6 w-6 items-center justify-center align-middle">
				<Sparkles class="h-5 w-5 text-slate-600" />
			</div>
		{/if}
		<input
			bind:this={input}
			bind:value={inputText}
			on:focus={() => (focusedElement = 'input')}
			placeholder="wanna see some magic?"
		/>
	</div>
	{#if suggestionText !== ''}
		<div class="mt-3">
			<textarea
				class=" overflow-scroll-y block h-48 w-full cursor-text resize-none rounded-sm px-2 pb-1 text-sm"
				on:focus={() => (focusedElement = 'suggestion')}
				bind:value={suggestionText}
				bind:this={aiTextArea}
			/>
			<button on:click={insertAISuggestion} bind:this={submit} on:focus={() => (focusedElement = 'submit')}
				>Insert <SendHorizontal class="ml-1 h-4 w-4" /></button
			>
		</div>
	{/if}
</div>

<style lang="postcss">
	input,
	textarea {
		@apply w-full border-[1px] border-slate-200 p-1 text-sm font-light tracking-wide outline-0 ring-0;
	}

	input {
		@apply ml-1;
	}

	textarea {
		@apply bg-slate-50 px-2 py-1 text-xs leading-5;
	}

	button {
		@apply float-right mt-2 flex flex-row items-center rounded-md bg-slate-100 px-2 py-1 align-middle text-sm hover:bg-slate-200;
	}

	.spinning {
		animation-name: spin;
		animation-duration: 2000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
