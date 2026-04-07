<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import BoldIcon from "@lucide/svelte/icons/bold";
	import ItalicIcon from "@lucide/svelte/icons/italic";
	import UnderlineIcon from "@lucide/svelte/icons/underline";

	const { Story } = defineMeta({
		title: "UI/ToggleGroup",
		component: ToggleGroup.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<ToggleGroup.Root type="multiple" spacing={1}>
			<ToggleGroup.Item value="bold" aria-label="Toggle bold">
				<BoldIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Toggle italic">
				<ItalicIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="underline" aria-label="Toggle underline">
				<UnderlineIcon />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
</Story>

<Story name="Outline">
	{#snippet template()}
		<ToggleGroup.Root variant="outline" type="single" value="all">
			<ToggleGroup.Item value="all" aria-label="Toggle all">All</ToggleGroup.Item>
			<ToggleGroup.Item value="missed" aria-label="Toggle missed">Missed</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<ToggleGroup.Root type="single" size="sm" value="top" variant="outline">
				<ToggleGroup.Item value="top" aria-label="Top">Top</ToggleGroup.Item>
				<ToggleGroup.Item value="bottom" aria-label="Bottom">Bottom</ToggleGroup.Item>
				<ToggleGroup.Item value="left" aria-label="Left">Left</ToggleGroup.Item>
				<ToggleGroup.Item value="right" aria-label="Right">Right</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="single" value="top" variant="outline">
				<ToggleGroup.Item value="top" aria-label="Top">Top</ToggleGroup.Item>
				<ToggleGroup.Item value="bottom" aria-label="Bottom">Bottom</ToggleGroup.Item>
				<ToggleGroup.Item value="left" aria-label="Left">Left</ToggleGroup.Item>
				<ToggleGroup.Item value="right" aria-label="Right">Right</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Filter">
	{#snippet template()}
		<ToggleGroup.Root type="single" value="all" variant="outline" size="sm">
			<ToggleGroup.Item value="all" aria-label="All">All</ToggleGroup.Item>
			<ToggleGroup.Item value="active" aria-label="Active">Active</ToggleGroup.Item>
			<ToggleGroup.Item value="completed" aria-label="Completed">Completed</ToggleGroup.Item>
			<ToggleGroup.Item value="archived" aria-label="Archived">Archived</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
</Story>

<Story name="Vertical">
	{#snippet template()}
		<ToggleGroup.Root type="multiple" orientation="vertical" spacing={2}>
			<ToggleGroup.Item value="bold" aria-label="Toggle bold">
				<BoldIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Toggle italic">
				<ItalicIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="underline" aria-label="Toggle underline">
				<UnderlineIcon />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
</Story>
