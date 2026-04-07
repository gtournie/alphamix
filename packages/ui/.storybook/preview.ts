import type { Preview } from '@storybook/svelte';
import '../src/app.css';

const preview: Preview = {
	decorators: [
		(story, context) => {
			const isDark = context.globals?.backgrounds?.value === 'dark';
			document.documentElement.classList.toggle('dark', isDark);
			return story();
		}
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			default: 'light',
			values: [
				{ name: 'light', value: 'hsl(0, 0%, 100%)' },
				{ name: 'dark', value: 'hsl(240, 10%, 3.9%)' }
			]
		}
	}
};

export default preview;
