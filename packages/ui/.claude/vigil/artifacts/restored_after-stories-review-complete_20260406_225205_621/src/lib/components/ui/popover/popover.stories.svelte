<script module>
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
					<Button variant="outline" {...props}>Open Popover</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content align="start">
				<Popover.Header>
					<Popover.Title>Dimensions</Popover.Title>
					<Popover.Description>Set the dimensions for the layer.</Popover.Description>
				</Popover.Header>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Align">
	{#snippet template()}
		<div class="flex gap-6">
			{#each ["start", "center", "end"] as align}
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="sm" {...props}>{align.charAt(0).toUpperCase() + align.slice(1)}</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-40" {align}>
						Aligned to {align}
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
			<Popover.Content class="w-64" align="start">
				<Popover.Header>
					<Popover.Title>Dimensions</Popover.Title>
					<Popover.Description>Set the dimensions for the layer.</Popover.Description>
				</Popover.Header>
				<Field.Group class="gap-4">
					<Field.Field orientation="horizontal">
						<Field.Label class="w-1/2" for="pop-width">Width</Field.Label>
						<Input id="pop-width" value="100%" />
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Field.Label class="w-1/2" for="pop-height">Height</Field.Label>
						<Input id="pop-height" value="25px" />
					</Field.Field>
				</Field.Group>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>
