<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import tippy, { type Instance } from 'tippy.js';
	import { Keyboard, SendHorizontal, Sparkles } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { selectionText } from '$lib/stores/editor';
	import { aiButtons, modificationContext } from '$lib/prompts';
	import { getStream, consumeString } from '$lib/clients/openAI';
	import { tick } from 'svelte';

	export let editor: Editor;
	let instance: Instance;
	let button: HTMLButtonElement;
	let menu: HTMLDivElement;
	let customInput: HTMLInputElement;

	let submitButton: HTMLButtonElement;
	let aiTextArea: HTMLTextAreaElement;
	let customInputText = '';
	let suggestionText = '';
	let loading = false;

	onMount(async () => {
		if (menu) {
			instance = tippy(button, {
				content: menu,
				showOnCreate: false,
				interactive: true,
				placement: 'bottom-start',
				trigger: 'click',
				maxWidth: 400,
				onShow: () => {
					tick().then(() => {
						customInput.focus();
					});
				}
			});
		}
	});

	//key handler for the custom modification input
	const keyHandler = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			const inputElement = e.currentTarget as HTMLInputElement;

			// Disable the input
			inputElement.disabled = true;

			try {
				// Wait for the AI response
				await getAIResponse(customInputText);
			} catch (error) {
				console.error('Error getting AI response:', error);
			} finally {
				// Always re-enable the input, even if there was an error
				console.log('we done');
				inputElement.disabled = false;
			}
		}
	};

	//inserts the suggestion
	const insertAISuggestion = () => {
		if (editor) editor.chain().deleteSelection().focus().insertContent(suggestionText.replace('\n', '<br>')).run();
		suggestionText = '';
	};

	//a callback to pass to the consumption function that appends the openAI text chunk and scrolls to the bottom
	const updateContentCallback = (s: string) => {
		suggestionText = suggestionText + s;
		if (aiTextArea) {
			aiTextArea.scrollTop = aiTextArea.scrollHeight;
		}
	};

	//send the selected text and the modification context to OPEN AI and consume the string
	const getAIResponse = async (prompt: string) => {
		loading = true;
		try {
			suggestionText = '';
			const response = await getStream({ content: prompt + $selectionText, context: modificationContext });
			await consumeString({ callback: updateContentCallback, response });
			submitButton.focus();
			loading = false;
		} catch (error) {
			console.error(error);
		}
	};
</script>

<button
	bind:this={button}
	class="flex h-full flex-row items-center justify-center whitespace-nowrap px-2 align-middle text-sm hover:bg-slate-100"
>
	<Sparkles class="h-4 w-4" />
</button>

<div bind:this={menu}>
	<div class="w-[400px] rounded border border-stone-200 bg-white p-3 shadow-xl ring-1 ring-slate-300">
		<!-- Heading -->
		<div class="mb-3 mt-1 flex flex-row items-center align-middle text-sm">
			{#if loading}
				<div class="flex h-6 w-6 animate-spin items-center justify-center">
					<Sparkles class="h-4 w-4 text-indigo-600" />
				</div>
			{:else}
				<div class="flex h-6 w-6 items-center justify-center">
					<Sparkles class="h-4 w-4" />
				</div>
			{/if}
			<div>Modify Text</div>
		</div>
		<!-- Buttons -->
		<div class="flex flex-row flex-wrap gap-2">
			{#each aiButtons as { label, prompt }}
				<button
					class="modification"
					disabled={loading}
					on:click|preventDefault|stopPropagation={() => getAIResponse(prompt)}>{label}</button
				>
			{/each}
		</div>
		<!-- Custom Input -->
		<input
			type="text"
			placeholder="Customer Modification"
			bind:this={customInput}
			bind:value={customInputText}
			on:keydown={keyHandler}
		/>
		<!-- AI Response Text Box -->
		{#if suggestionText !== ''}
			<div class="mt-3 flex w-full flex-col items-end">
				<textarea
					class=" overflow-scroll-y block h-48 w-full cursor-text resize-none rounded-sm px-2 pb-1 text-sm"
					bind:value={suggestionText}
					bind:this={aiTextArea}
				/>
				<button class="submit" on:click={insertAISuggestion} bind:this={submitButton}>
					Insert <SendHorizontal class="ml-1 h-4 w-4" />
				</button>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	button.modification {
		@apply rounded-md border-[1px] border-slate-200 px-1.5 py-0.5 text-sm shadow-sm hover:bg-slate-100;
	}

	input {
		@apply mt-4 w-full rounded-md border-[1px] border-slate-200 px-2 py-2 text-sm shadow-sm;
	}

	button.submit {
		@apply mt-2 flex w-20 flex-row items-center rounded-md bg-slate-100 px-2 py-1 align-middle text-sm hover:bg-slate-200;
	}

	textarea {
		@apply mt-4 w-full resize-none rounded-md border-[1px] border-slate-200 p-2 text-sm shadow-sm;
	}
</style>
