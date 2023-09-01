/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				fadeIn: 'fadeIn 500ms ease-in-out forwards',
				fadeOut: 'fadeOut 500ms ease-in-out forwards',
				spinning: 'spin 2s linear infinite'
			},
			keyframes: {
				fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 100 } },
				fadeOut: { '0%': { opacity: 100 }, '100%': { opacity: 0 } },
				spin: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } }
			}
		}
	},
	plugins: []
};

// .spinning {
// 	animation-name: spin;
// 	animation-duration: 2000ms;
// 	animation-iteration-count: infinite;
// 	animation-timing-function: linear;
// }

// @keyframes spin {
// 	from {
// 		transform: rotate(0deg);
// 	}
// 	to {
// 		transform: rotate(360deg);
// 	}
// }
