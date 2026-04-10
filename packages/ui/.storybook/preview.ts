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
		},
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'error'
		}
		// ^ set to 'error' so `bun run test` fails on accessibility
		// violations instead of silently logging them. To temporarily
		// suppress a11y failures while iterating, switch back to 'todo'.
	}
};

export default preview;
