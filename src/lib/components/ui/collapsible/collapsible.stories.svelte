<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		Field,
		FieldGroup,
		FieldLabel,
	} from "$lib/components/ui/field/index.js";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import FileIcon from "@lucide/svelte/icons/file";
	import FolderIcon from "@lucide/svelte/icons/folder";
	import MaximizeIcon from "@lucide/svelte/icons/maximize";
	import MinimizeIcon from "@lucide/svelte/icons/minimize";

	const fileTree = [
		{
			name: "components",
			items: [
				{
					name: "ui",
					items: [
						{ name: "button.tsx" },
						{ name: "card.tsx" },
						{ name: "dialog.tsx" },
						{ name: "input.tsx" },
						{ name: "select.tsx" },
						{ name: "table.tsx" },
					],
				},
				{ name: "login-form.tsx" },
				{ name: "register-form.tsx" },
			],
		},
		{
			name: "lib",
			items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
		},
		{
			name: "hooks",
			items: [
				{ name: "use-media-query.ts" },
				{ name: "use-debounce.ts" },
				{ name: "use-local-storage.ts" },
			],
		},
		{
			name: "types",
			items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
		},
		{
			name: "public",
			items: [
				{ name: "favicon.ico" },
				{ name: "logo.svg" },
				{ name: "images" },
			],
		},
		{ name: "app.tsx" },
		{ name: "layout.tsx" },
		{ name: "globals.css" },
		{ name: "package.json" },
		{ name: "tsconfig.json" },
		{ name: "README.md" },
		{ name: ".gitignore" },
	];

	const { Story } = defineMeta({
		title: "UI/Collapsible",
		component: Collapsible.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let isOpen = $state(false);
</script>

<Story name="Basic">
	{#snippet template()}
		<Card.Root class="mx-auto w-full max-w-sm">
			<Card.Content>
				<Collapsible.Root class="rounded-md data-[state=open]:bg-muted">
					<Collapsible.Trigger
						class={buttonVariants({ variant: "ghost", class: "group w-full" })}
					>
						Product details
						<ChevronDownIcon
							class="ml-auto group-data-[state=open]:rotate-180"
						/>
					</Collapsible.Trigger>
					<Collapsible.Content
						class="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm"
					>
						<div>
							This panel can be expanded or collapsed to reveal additional
							content.
						</div>
						<Button size="xs">Learn More</Button>
					</Collapsible.Content>
				</Collapsible.Root>
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Settings Panel">
	{#snippet template()}
		<Card.Root class="mx-auto w-full max-w-xs" size="sm">
			<Card.Header>
				<Card.Title>Radius</Card.Title>
				<Card.Description
					>Set the corner radius of the element.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<Collapsible.Root bind:open={isOpen} class="flex items-start gap-2">
					<FieldGroup class="grid w-full grid-cols-2 gap-2">
						<Field>
							<FieldLabel for="radius-x" class="sr-only">Radius X</FieldLabel>
							<Input id="radius-x" placeholder="0" value={0} />
						</Field>
						<Field>
							<FieldLabel for="radius-y" class="sr-only">Radius Y</FieldLabel>
							<Input id="radius-y" placeholder="0" value={0} />
						</Field>
						<Collapsible.Content
							class="col-span-full grid grid-cols-subgrid gap-2"
						>
							<Field>
								<FieldLabel for="radius-x2" class="sr-only">Radius X</FieldLabel
								>
								<Input id="radius-x2" placeholder="0" value={0} />
							</Field>
							<Field>
								<FieldLabel for="radius-y2" class="sr-only">Radius Y</FieldLabel
								>
								<Input id="radius-y2" placeholder="0" value={0} />
							</Field>
						</Collapsible.Content>
					</FieldGroup>
					<Collapsible.Trigger
						class={buttonVariants({ variant: "outline", size: "icon" })}
						aria-label={isOpen ? "Collapse advanced radius" : "Expand advanced radius"}
					>
						{#if isOpen}
							<MinimizeIcon />
						{:else}
							<MaximizeIcon />
						{/if}
					</Collapsible.Trigger>
				</Collapsible.Root>
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="File Tree">
	{#snippet renderItem(item)}
		{#if "items" in item}
			<Collapsible.Root>
				<Collapsible.Trigger
					class={buttonVariants({
						variant: "ghost",
						size: "sm",
						class:
							"group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground",
					})}
				>
					<ChevronRightIcon
						class="transition-transform group-data-[state=open]:rotate-90"
					/>
					<FolderIcon />
					{item.name}
				</Collapsible.Trigger>
				<Collapsible.Content class="mt-1 ml-5">
					<div class="flex flex-col gap-1">
						{#each item.items as child}
							{@render renderItem(child)}
						{/each}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		{:else}
			<Button
				variant="link"
				size="sm"
				class="w-full justify-start gap-2 text-foreground"
			>
				<FileIcon />
				<span>{item.name}</span>
			</Button>
		{/if}
	{/snippet}
	{#snippet template()}
		<Card.Root class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
			<Card.Header>
				<Tabs.Root>
					<Tabs.List class="w-full">
						<Tabs.Trigger value="explorer">Explorer</Tabs.Trigger>
						<Tabs.Trigger value="settings">Outline</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col gap-1">
					{#each fileTree as item}
						{@render renderItem(item)}
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>
