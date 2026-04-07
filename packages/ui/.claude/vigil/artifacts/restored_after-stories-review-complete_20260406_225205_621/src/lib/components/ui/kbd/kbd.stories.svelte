<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Kbd from "$lib/components/ui/kbd/index.js";
	import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import SearchIcon from "@lucide/svelte/icons/search";

	const { Story } = defineMeta({
		title: "UI/Kbd",
		component: Kbd.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Group">
	{#snippet template()}
		<div class="flex flex-col items-center gap-4">
			<p class="text-muted-foreground text-sm">
				Use
				<Kbd.Group>
					<Kbd.Root>Ctrl + B</Kbd.Root>
					<Kbd.Root>Ctrl + K</Kbd.Root>
				</Kbd.Group>
				to open the command palette
			</p>
		</div>
	{/snippet}
</Story>

<Story name="Button">
	{#snippet template()}
		<div class="flex flex-wrap items-center gap-4">
			<Button variant="outline" size="sm" class="pe-2">
				Accept <Kbd.Root>⏎</Kbd.Root>
			</Button>
			<Button variant="outline" size="sm" class="pe-2">
				Cancel <Kbd.Root>Esc</Kbd.Root>
			</Button>
		</div>
	{/snippet}
</Story>

<Story name="Tooltip">
	{#snippet template()}
		<div class="flex flex-wrap gap-4">
			<ButtonGroup.Root>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button size="sm" variant="outline" {...props}>Save</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						<div class="flex items-center gap-2">
							Save Changes <Kbd.Root>S</Kbd.Root>
						</div>
					</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button size="sm" variant="outline" {...props}>Print</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						<div class="flex items-center gap-2">
							Print Document
							<Kbd.Group>
								<Kbd.Root>Ctrl</Kbd.Root>
								<Kbd.Root>P</Kbd.Root>
							</Kbd.Group>
						</div>
					</Tooltip.Content>
				</Tooltip.Root>
			</ButtonGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Input Group">
	{#snippet template()}
		<div class="flex w-full max-w-xs flex-col gap-6">
			<InputGroup.Root>
				<InputGroup.Input placeholder="Search..." />
				<InputGroup.Addon>
					<SearchIcon />
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<Kbd.Root>⌘</Kbd.Root>
					<Kbd.Root>K</Kbd.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>
