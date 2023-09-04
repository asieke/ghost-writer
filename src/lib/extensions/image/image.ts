import ImageMenu from '$lib/extensions/image/ImageMenu.svelte';
import tippy, { type Instance } from 'tippy.js';

let instance: Instance;

export const showImageMenu = (target: HTMLElement | null, callback: (url: string) => void) => {
	const targetElement = target || document.body;
	const isBody = targetElement === document.body;

	const element = document.createElement('div');

	instance = tippy(targetElement, {
		content: element,
		showOnCreate: false,
		interactive: true,
		trigger: 'manual',
		placement: 'bottom-start',
		offset: [isBody ? window.innerWidth / 2 - 250 : 0, isBody ? 100 : 0],
		onClickOutside: (instance) => {
			instance.destroy();
		}
	});

	const component = new ImageMenu({
		target: element,
		props: {
			instance,
			callback
		}
	});

	instance.show();
};
