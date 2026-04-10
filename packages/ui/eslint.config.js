import svelteParser from "svelte-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import tsEslint from "typescript-eslint";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

const tailwindSettings = {
	entryPoint: "src/app.css",
};

export default [
	{
		files: ["src/**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
			},
		},
		plugins: {
			"@typescript-eslint": tsEslint.plugin,
			"better-tailwindcss": betterTailwindcss,
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"better-tailwindcss/enforce-canonical-classes": ["warn", tailwindSettings],
			"better-tailwindcss/no-duplicate-classes": ["warn", tailwindSettings],
			"better-tailwindcss/no-conflicting-classes": ["warn", tailwindSettings],
			"better-tailwindcss/enforce-shorthand-classes": ["warn", tailwindSettings],
		},
	},
];
