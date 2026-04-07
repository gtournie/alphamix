<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import BoldIcon from "@lucide/svelte/icons/bold";
	import ItalicIcon from "@lucide/svelte/icons/italic";
	import UnderlineIcon from "@lucide/svelte/icons/underline";

	const { Story } = defineMeta({
		title: "UI/Toggle",
		component: Toggle,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<div class="flex flex-wrap items-center gap-2">
			<Toggle aria-label="Toggle bold" pressed>
				<BoldIcon />
			</Toggle>
			<Toggle aria-label="Toggle italic">
				<ItalicIcon />
			</Toggle>
			<Toggle aria-label="Toggle underline">
				<UnderlineIcon />
			</Toggle>
		</div>
	{/snippet}
</Story>

<Story name="Outline">
	{#snippet template()}
		<div class="flex flex-wrap items-center gap-2">
			<Toggle variant="outline" aria-label="Toggle italic">
				<ItalicIcon />
				Italic
			</Toggle>
			<Toggle variant="outline" aria-label="Toggle bold">
				<BoldIcon />
				Bold
			</Toggle>
		</div>
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template()}
		<div class="flex flex-wrap items-center gap-2">
			<Toggle variant="outline" aria-label="Toggle small" size="sm">Small</Toggle>
			<Toggle variant="outline" aria-label="Toggle default" size="default">Default</Toggle>
			<Toggle variant="outline" aria-label="Toggle large" size="lg">Large</Toggle>
		</div>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<div class="flex flex-wrap items-center gap-2">
			<Toggle aria-label="Toggle disabled" disabled>Disabled</Toggle>
			<Toggle variant="outline" aria-label="Toggle disabled outline" disabled>Disabled</Toggle>
		</div>
	{/snippet}
</Story>
