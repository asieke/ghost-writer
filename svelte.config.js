import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$styles: './src/styles',
			$components: './src/components',
			$extensions: './src/extensions',
			$types: './src/types'
		}
	},
	preprocess: vitePreprocess()
};
export default config;
