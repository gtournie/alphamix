<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import XIcon from "@lucide/svelte/icons/x";
	import GlobeIcon from "@lucide/svelte/icons/globe";

	const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

	const timezones = [
		{
			value: "Americas",
			items: [
				"(GMT-5) New York",
				"(GMT-8) Los Angeles",
				"(GMT-6) Chicago",
				"(GMT-5) Toronto",
				"(GMT-3) São Paulo",
			],
		},
		{
			value: "Europe",
			items: [
				"(GMT+0) London",
				"(GMT+1) Paris",
				"(GMT+1) Berlin",
				"(GMT+1) Rome",
				"(GMT+1) Madrid",
			],
		},
		{
			value: "Asia/Pacific",
			items: [
				"(GMT+9) Tokyo",
				"(GMT+8) Shanghai",
				"(GMT+8) Singapore",
				"(GMT+4) Dubai",
				"(GMT+11) Sydney",
			],
		},
	];

	const countries = [
		{ code: "us", label: "United States", continent: "Americas" },
		{ code: "gb", label: "United Kingdom", continent: "Europe" },
		{ code: "fr", label: "France", continent: "Europe" },
		{ code: "de", label: "Germany", continent: "Europe" },
		{ code: "jp", label: "Japan", continent: "Asia" },
		{ code: "br", label: "Brazil", continent: "Americas" },
		{ code: "au", label: "Australia", continent: "Asia/Pacific" },
		{ code: "in", label: "India", continent: "Asia" },
		{ code: "ca", label: "Canada", continent: "Americas" },
		{ code: "za", label: "South Africa", continent: "Africa" },
	];

	const { Story } = defineMeta({
		title: "UI/Combobox",
		tags: ["autodocs"],
		parameters: {
			docs: {
				description: {
					component:
						"Autocomplete input built from Popover + Command primitives.",
				},
			},
		},
	});
</script>

<script lang="ts">
	let basicOpen = $state(false);
	let basicValue = $state("");

	let multipleOpen = $state(false);
	let multipleValues = $state<string[]>([]);

	let clearOpen = $state(false);
	let clearValue = $state(frameworks[0]);

	let groupsOpen = $state(false);
	let groupsValue = $state("");

	let customOpen = $state(false);
	let customValue = $state("");

	let invalidOpen = $state(false);
	let invalidValue = $state("");

	let disabledOpen = $state(false);
	let disabledValue = $state("");

	let autoOpen = $state(false);
	let autoSelected = $state("Next.js");
	let autoHighlight = $state("Next.js");

	let objectValueOpen = $state(false);
	let objectValue = $state<(typeof countries)[number] | null>(null);

	let addonOpen = $state(false);
	let addonValue = $state("");

	function toggleMultiple(value: string) {
		if (multipleValues.includes(value)) {
			multipleValues = multipleValues.filter((v) => v !== value);
		} else {
			multipleValues = [...multipleValues, value];
		}
	}
</script>

<Story name="Basic">
	{#snippet template()}
		<Popover.Root bind:open={basicOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						variant="outline"
						role="combobox"
						class="w-52 justify-between"
						aria-label="Select a framework"
						{...props}
					>
						{basicValue || "Select a framework"}
						<ChevronsUpDownIcon
							class="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-52 p-0">
				<Command.Root>
					<Command.Input placeholder="Search framework..." />
					<Command.List>
						<Command.Empty>No items found.</Command.Empty>
						<Command.Group>
							{#each frameworks as fw}
								<Command.Item
									value={fw}
									onSelect={() => {
										basicValue = fw === basicValue ? "" : fw;
										basicOpen = false;
									}}
								>
									<CheckIcon
										class={cn(
											"mr-2 size-4",
											basicValue === fw ? "opacity-100" : "opacity-0",
										)}
										aria-hidden="true"
									/>
									{fw}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Multiple">
	{#snippet template()}
		<Popover.Root bind:open={multipleOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						variant="outline"
						role="combobox"
						class="w-52 justify-between"
						aria-label="Select frameworks"
						{...props}
					>
						{multipleValues.length > 0
							? `${multipleValues.length} selected`
							: "Select frameworks"}
						<ChevronsUpDownIcon
							class="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-52 p-0">
				<Command.Root>
					<Command.Input placeholder="Search frameworks" />
					<Command.List>
						<Command.Empty>No items found.</Command.Empty>
						<Command.Group>
							{#each frameworks as fw}
								<Command.Item value={fw} onSelect={() => toggleMultiple(fw)}>
									<CheckIcon
										class={cn(
											"mr-2 size-4",
											multipleValues.includes(fw) ? "opacity-100" : "opacity-0",
										)}
										aria-hidden="true"
									/>
									{fw}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Clear Button">
	{#snippet template()}
		<Popover.Root bind:open={clearOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<div
						{...props}
						role="combobox"
						tabindex="0"
						aria-label="Select a framework"
						class={cn(
							buttonVariants({ variant: "outline" }),
							"w-52 cursor-pointer justify-between font-normal",
						)}
					>
						<span class="truncate">{clearValue || "Select a framework"}</span>
						<span class="ml-auto flex items-center gap-1">
							{#if clearValue}
								<button
									type="button"
									aria-label="Clear selection"
									class="rounded-sm p-1 -m-0.5 border border-transparent opacity-50 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring"
									onclick={(e) => {
										e.stopPropagation();
										clearValue = "";
									}}
								>
									<XIcon class="size-3" aria-hidden="true" />
								</button>
							{/if}
							<ChevronsUpDownIcon
								class="size-4 opacity-50"
								aria-hidden="true"
							/>
						</span>
					</div>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-52 p-0">
				<Command.Root>
					<Command.Input placeholder="Select a framework" />
					<Command.List>
						<Command.Empty>No items found.</Command.Empty>
						<Command.Group>
							{#each frameworks as fw}
								<Command.Item
									value={fw}
									onSelect={() => {
										clearValue = fw === clearValue ? "" : fw;
										clearOpen = false;
									}}
								>
									<CheckIcon
										class={cn(
											"mr-2 size-4",
											clearValue === fw ? "opacity-100" : "opacity-0",
										)}
										aria-hidden="true"
									/>
									{fw}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Groups">
	{#snippet template()}
		<Popover.Root bind:open={groupsOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						variant="outline"
						role="combobox"
						class="w-60 justify-between"
						aria-label="Select a timezone"
						{...props}
					>
						{groupsValue || "Select a timezone"}
						<ChevronsUpDownIcon
							class="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-60 p-0">
				<Command.Root>
					<Command.Input placeholder="Select a timezone" />
					<Command.List>
						<Command.Empty>No timezones found.</Command.Empty>
						{#each timezones as group}
							<Command.Group heading={group.value}>
								{#each group.items as tz}
									<Command.Item
										value={tz}
										onSelect={() => {
											groupsValue = tz === groupsValue ? "" : tz;
											groupsOpen = false;
										}}
									>
										<CheckIcon
											class={cn(
												"mr-2 size-4",
												groupsValue === tz ? "opacity-100" : "opacity-0",
											)}
											aria-hidden="true"
										/>
										{tz}
									</Command.Item>
								{/each}
							</Command.Group>
						{/each}
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Custom Items">
	{#snippet template()}
		<Popover.Root bind:open={customOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						variant="outline"
						role="combobox"
						class="w-64 justify-between font-normal"
						aria-label="Search countries"
						{...props}
					>
						{customValue || "Search countries..."}
						<ChevronsUpDownIcon
							class="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-64 p-0">
				<Command.Root>
					<Command.Input placeholder="Search countries..." />
					<Command.List>
						<Command.Empty>No countries found.</Command.Empty>
						<Command.Group>
							{#each countries as country}
								<Command.Item
									value={country.label}
									onSelect={() => {
										customValue =
											country.label === customValue ? "" : country.label;
										customOpen = false;
									}}
								>
									<CheckIcon
										class={cn(
											"mr-2 size-4",
											customValue === country.label
												? "opacity-100"
												: "opacity-0",
										)}
										aria-hidden="true"
									/>
									<span class="flex flex-col">
										<span class="text-sm">{country.label}</span>
										<span class="text-muted-foreground text-xs"
											>{country.continent} ({country.code.toUpperCase()})</span
										>
									</span>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field data-invalid="true" class="w-fit">
			<Popover.Root bind:open={invalidOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							variant="outline"
							role="combobox"
							class="w-52 justify-between"
							aria-label="Select a framework"
							{...props}
							aria-invalid="true"
							id="combobox-invalid"
						>
							{invalidValue || "Select a framework"}
							<ChevronsUpDownIcon
								class="ml-2 size-4 shrink-0 opacity-50"
								aria-hidden="true"
							/>
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-52 p-0">
					<Command.Root>
						<Command.Input placeholder="Select a framework" />
						<Command.List>
							<Command.Empty>No items found.</Command.Empty>
							<Command.Group>
								{#each frameworks as fw}
									<Command.Item
										value={fw}
										onSelect={() => {
											invalidValue = fw === invalidValue ? "" : fw;
											invalidOpen = false;
										}}
									>
										<CheckIcon
											class={cn(
												"mr-2 size-4",
												invalidValue === fw ? "opacity-100" : "opacity-0",
											)}
											aria-hidden="true"
										/>
										{fw}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Popover.Root bind:open={disabledOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						variant="outline"
						role="combobox"
						class="w-52 justify-between"
						aria-label="Select a framework"
						{...props}
						disabled
					>
						{disabledValue || "Select a framework"}
						<ChevronsUpDownIcon
							class="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-52 p-0">
				<Command.Root>
					<Command.Input placeholder="Select a framework" />
					<Command.List>
						<Command.Empty>No items found.</Command.Empty>
						<Command.Group>
							{#each frameworks as fw}
								<Command.Item value={fw} disabled>{fw}</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Auto Highlight">
	{#snippet template()}
		<Popover.Root
			bind:open={autoOpen}
			onOpenChange={(open) => {
				if (open) autoHighlight = autoSelected;
			}}
		>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						variant="outline"
						role="combobox"
						class="w-52 justify-between"
						aria-label="Select a framework"
						{...props}
					>
						{autoSelected || "Select a framework"}
						<ChevronsUpDownIcon
							class="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-52 p-0">
				<Command.Root bind:value={autoHighlight}>
					<Command.Input placeholder="Select a framework" />
					<Command.List>
						<Command.Empty>No items found.</Command.Empty>
						<Command.Group>
							{#each frameworks as fw}
								<Command.Item
									value={fw}
									onSelect={() => {
										autoSelected = fw === autoSelected ? "" : fw;
										autoHighlight = autoSelected;
										autoOpen = false;
									}}
								>
									<CheckIcon
										class={cn(
											"mr-2 size-4",
											autoSelected === fw ? "opacity-100" : "opacity-0",
										)}
										aria-hidden="true"
									/>
									{fw}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<Story name="Object Value">
	{#snippet template()}
		<Popover.Root bind:open={objectValueOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						variant="outline"
						class="w-64 justify-between font-normal"
						role="combobox"
						aria-label="Select a country"
						{...props}
					>
						{objectValue?.label ?? "Select a country"}
						<ChevronsUpDownIcon
							class="ml-2 size-4 shrink-0 opacity-50"
							aria-hidden="true"
						/>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-64 p-0">
				<Command.Root>
					<Command.Input placeholder="Search" />
					<Command.List>
						<Command.Empty>No items found.</Command.Empty>
						<Command.Group>
							{#each countries as country}
								<Command.Item
									value={country.label}
									onSelect={() => {
										objectValue =
											objectValue?.code === country.code ? null : country;
										objectValueOpen = false;
									}}
								>
									<CheckIcon
										class={cn(
											"mr-2 size-4",
											objectValue?.code === country.code
												? "opacity-100"
												: "opacity-0",
										)}
										aria-hidden="true"
									/>
									{country.label}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story>

<!-- 
// Doesn't full work:
// still need to fix background of InputGroup on hover (in dark mode)
// previous patch added a lot of classes on InputGroup.Addon so if we need this kind of component
// better to create a right one and not just a demo in storybook

<Story name="Input Group">
	{#snippet template()}
		<Popover.Root bind:open={addonOpen}>
			<InputGroup.Root class="w-fit">
				<InputGroup.Addon class="group-hover/input-group:bg-muted dark:group-hover/input-group:bg-muted/50 group-hover/input-group:text-foreground rounded-l-[calc(var(--radius-lg)-1px)] transition-colors">
					<GlobeIcon class="size-4" aria-hidden="true" />
				</InputGroup.Addon>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							variant="ghost"
							role="combobox"
							class="w-60 justify-between font-normal rounded-l-none"
							aria-label="Select a timezone"
							{...props}
						>
							{addonValue || "Select a timezone"}
							<ChevronsUpDownIcon
								class="ml-2 size-4 shrink-0 opacity-50"
								aria-hidden="true"
							/>
						</Button>
					{/snippet}
				</Popover.Trigger>
			</InputGroup.Root>
			<Popover.Content class="w-60 p-0">
				<Command.Root>
					<Command.Input placeholder="Select a timezone" />
					<Command.List>
						<Command.Empty>No timezones found.</Command.Empty>
						{#each timezones as group}
							<Command.Group heading={group.value}>
								{#each group.items as tz}
									<Command.Item
										value={tz}
										onSelect={() => {
											addonValue = tz === addonValue ? "" : tz;
											addonOpen = false;
										}}
									>
										<CheckIcon
											class={cn(
												"mr-2 size-4",
												addonValue === tz ? "opacity-100" : "opacity-0",
											)}
											aria-hidden="true"
										/>
										{tz}
									</Command.Item>
								{/each}
							</Command.Group>
						{/each}
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{/snippet}
</Story> -->
