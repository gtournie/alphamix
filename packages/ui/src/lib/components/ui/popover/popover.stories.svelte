<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";

	const { Story } = defineMeta({
		title: "UI/Popover",
		component: Popover.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open popover</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-64" align="start">
				<Popover.Header>
					<Popover.Title>Dimensions</Popover.Title>
					<Popover.Description
						>Set the dimensions for the layer.</Popover.Description
					>
				</Popover.Header>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Align">
	{#snippet template()}
		<div class="flex flex-wrap gap-4">
			{#each ["start", "center", "end"] as align}
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>{align}</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-40" {align}>
						<p class="text-muted-foreground text-sm">Aligned to {align}.</p>
					</Popover.Content>
				</Popover.Root>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="With Form">
	{#snippet template()}
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open Popover</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-72" align="start">
				<Popover.Header>
					<Popover.Title>Dimensions</Popover.Title>
					<Popover.Description
						>Set the dimensions for the layer.</Popover.Description
					>
				</Popover.Header>
				<Field.Group>
					<Field.Field>
						<Field.Label for="pop-width">Width</Field.Label>
						<Input id="pop-width" value="100%" />
					</Field.Field>
					<Field.Field>
						<Field.Label for="pop-height">Height</Field.Label>
						<Input id="pop-height" value="25px" />
					</Field.Field>
				</Field.Group>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>
