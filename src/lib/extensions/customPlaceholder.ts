import Placeholder from '@tiptap/extension-placeholder';

export const CustomPlaceholder = Placeholder.configure({
	placeholder: ({ node, editor }) => {
		const { pos } = editor.state.selection.$from;
		if (node.type.name === 'heading' && pos === 1) {
			return 'What’s the title?';
		} else if (node.type.name === 'heading') {
			return 'Hit me with a sexy heading!';
		} else if (node.type.name === 'codeBlock') {
			return '//time to code!!';
		}

		return whimsicalQuotes[Math.floor(Math.random() * whimsicalQuotes.length)];
	}
});

const whimsicalQuotes = [
	'Unleash your creative dragon, set fire to the page!',
	"Your ideas need sunlight, don't hide them away!",
	'Dream the whimsical, write the unachievable!',
	'Write it down before another cloud floats by...',
	'Your words are the paint, the page is your canvas.',
	'Find the pixie dust within your thoughts and sprinkle it on your writing!',
	'Turn the key, unlock your brain, let imagination spill out!',
	'Remember, even diamonds started in the rough. Keep polishing.',
	'Not all heroes wear capes, some use words to save the day.',
	'Chisel away the unnecessary, reveal the statue within the stone.',
	'Each tap of the key is a step on the moon. Keep going.',
	"Writing is magic, and you're the wizard, let's cast a spell!",
	'Brew a potion of words, enchant your readers!',
	'Your mind is a garden. Grow a forest of tales.',
	'Hum the tune, write the lyrics, compose a symphony of words.',
	'Usher fiction into reality with the stroke of a pen.',
	'Bake a story, sweeten with characters, frost with imagination.',
	'You are the captain of your tale, steering towards undiscovered lands.',
	'Writing is your superpower, the world needs heroes!',
	'Your pen is your sword, your imagination is your shield. Battle on!'
];
