<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import BoldIcon from "@lucide/svelte/icons/bold";
	import ItalicIcon from "@lucide/svelte/icons/italic";

	const { Story } = defineMeta({
		title: "UI/Toggle",
		component: Toggle,
		tags: ["autodocs"],
		argTypes: {
			variant: { control: "select", options: ["default", "outline"] },
			size: { control: "select", options: ["sm", "default", "lg"] },
			pressed: { control: "boolean" },
			disabled: { control: "boolean" },
		},
	});
</script>

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

<Story name="With Text">
	{#snippet template()}
		<Toggle aria-label="Toggle italic">
			<ItalicIcon />
			Italic
		</Toggle>
	{/snippet}
</Story>

<Story name="Size">
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
