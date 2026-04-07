<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import BoldIcon from "@lucide/svelte/icons/bold";
	import ItalicIcon from "@lucide/svelte/icons/italic";
	import UnderlineIcon from "@lucide/svelte/icons/underline";

	const { Story } = defineMeta({
		title: "UI/ToggleGroup",
		component: ToggleGroup.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let fontWeight = $state("normal");
</script>

<Story name="Outline">
	{#snippet template()}
		<ToggleGroup.Root variant="outline" type="single" value="all">
			<ToggleGroup.Item value="all" aria-label="Toggle all">All</ToggleGroup.Item>
			<ToggleGroup.Item value="missed" aria-label="Toggle missed">Missed</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
</Story>

<Story name="Size">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<ToggleGroup.Root type="single" size="sm" value="top" variant="outline">
				<ToggleGroup.Item value="top" aria-label="Toggle top">Top</ToggleGroup.Item>
				<ToggleGroup.Item value="bottom" aria-label="Toggle bottom">Bottom</ToggleGroup.Item>
				<ToggleGroup.Item value="left" aria-label="Toggle left">Left</ToggleGroup.Item>
				<ToggleGroup.Item value="right" aria-label="Toggle right">Right</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="single" value="top" variant="outline">
				<ToggleGroup.Item value="top" aria-label="Toggle top">Top</ToggleGroup.Item>
				<ToggleGroup.Item value="bottom" aria-label="Toggle bottom">Bottom</ToggleGroup.Item>
				<ToggleGroup.Item value="left" aria-label="Toggle left">Left</ToggleGroup.Item>
				<ToggleGroup.Item value="right" aria-label="Toggle right">Right</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Spacing">
	{#snippet template()}
		<ToggleGroup.Root type="single" size="sm" value="top" variant="outline" spacing={2}>
			<ToggleGroup.Item value="top" aria-label="Toggle top">Top</ToggleGroup.Item>
			<ToggleGroup.Item value="bottom" aria-label="Toggle bottom">Bottom</ToggleGroup.Item>
			<ToggleGroup.Item value="left" aria-label="Toggle left">Left</ToggleGroup.Item>
			<ToggleGroup.Item value="right" aria-label="Toggle right">Right</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
</Story>

<Story name="Vertical">
	{#snippet template()}
		<ToggleGroup.Root type="multiple" orientation="vertical" spacing={1} value={["bold", "italic"]}>
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

<Story name="Disabled">
	{#snippet template()}
		<ToggleGroup.Root disabled type="multiple">
			<ToggleGroup.Item value="bold" aria-label="Toggle bold">
				<BoldIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Toggle italic">
				<ItalicIcon />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
				<UnderlineIcon />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	{/snippet}
</Story>

<Story name="Custom">
	{#snippet template()}
		<Field.Field>
			<Field.Label>Font Weight</Field.Label>
			<ToggleGroup.Root
				type="single"
				bind:value={fontWeight}
				variant="outline"
				spacing={2}
				size="lg"
			>
				<ToggleGroup.Item value="light" aria-label="Light" class="flex size-16 flex-col items-center justify-center rounded-xl">
					<span class="text-2xl leading-none font-light">Aa</span>
					<span class="text-muted-foreground text-xs">Light</span>
				</ToggleGroup.Item>
				<ToggleGroup.Item value="normal" aria-label="Normal" class="flex size-16 flex-col items-center justify-center rounded-xl">
					<span class="text-2xl leading-none font-normal">Aa</span>
					<span class="text-muted-foreground text-xs">Normal</span>
				</ToggleGroup.Item>
				<ToggleGroup.Item value="medium" aria-label="Medium" class="flex size-16 flex-col items-center justify-center rounded-xl">
					<span class="text-2xl leading-none font-medium">Aa</span>
					<span class="text-muted-foreground text-xs">Medium</span>
				</ToggleGroup.Item>
				<ToggleGroup.Item value="bold" aria-label="Bold" class="flex size-16 flex-col items-center justify-center rounded-xl">
					<span class="text-2xl leading-none font-bold">Aa</span>
					<span class="text-muted-foreground text-xs">Bold</span>
				</ToggleGroup.Item>
			</ToggleGroup.Root>
			<Field.Description>
				Use <code class="bg-muted rounded-md px-1 py-0.5 font-mono">font-{fontWeight}</code> to set the font weight.
			</Field.Description>
		</Field.Field>
	{/snippet}
</Story>
