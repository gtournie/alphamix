import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@chromatic-com/storybook',
		'@storybook/addon-themes'
	],
	framework: {
		name: '@storybook/svelte-vite',
		options: {}
	}
};

export default config;
