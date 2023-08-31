/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				fadeIn: 'fadeIn 500ms ease-in-out forwards',
				fadeOut: 'fadeOut 500ms ease-in-out forwards'
			},
			keyframes: {
				fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 100 } },
				fadeOut: { '0%': { opacity: 100 }, '100%': { opacity: 0 } }
			}
		}
	},
	plugins: []
};
