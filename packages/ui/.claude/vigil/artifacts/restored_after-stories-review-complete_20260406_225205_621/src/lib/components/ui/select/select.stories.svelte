<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";

	const fruits = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "grapes", label: "Grapes" },
		{ value: "pineapple", label: "Pineapple" },
	];

	const fruitGroups = [
		{
			label: "Fruits",
			items: [
				{ value: "apple", label: "Apple" },
				{ value: "banana", label: "Banana" },
				{ value: "blueberry", label: "Blueberry" },
			],
		},
		{
			label: "Vegetables",
			items: [
				{ value: "carrot", label: "Carrot" },
				{ value: "broccoli", label: "Broccoli" },
				{ value: "spinach", label: "Spinach" },
			],
		},
	];

	const allGroupItems = fruitGroups.flatMap((g) => g.items);

	const timezoneGroups = [
		{
			label: "North America",
			items: [
				{ value: "est", label: "Eastern Standard Time" },
				{ value: "cst", label: "Central Standard Time" },
				{ value: "mst", label: "Mountain Standard Time" },
				{ value: "pst", label: "Pacific Standard Time" },
				{ value: "akst", label: "Alaska Standard Time" },
				{ value: "hst", label: "Hawaii Standard Time" },
			],
		},
		{
			label: "Europe & Africa",
			items: [
				{ value: "gmt", label: "Greenwich Mean Time" },
				{ value: "cet", label: "Central European Time" },
				{ value: "eet", label: "Eastern European Time" },
				{ value: "west", label: "Western European Summer Time" },
				{ value: "cat", label: "Central Africa Time" },
				{ value: "eat", label: "East Africa Time" },
			],
		},
		{
			label: "Asia",
			items: [
				{ value: "msk", label: "Moscow Time" },
				{ value: "ist", label: "India Standard Time" },
				{ value: "cst_china", label: "China Standard Time" },
				{ value: "jst", label: "Japan Standard Time" },
				{ value: "kst", label: "Korea Standard Time" },
				{ value: "ist_indonesia", label: "Indonesia Central Standard Time" },
			],
		},
		{
			label: "Australia & Pacific",
			items: [
				{ value: "awst", label: "Australian Western Standard Time" },
				{ value: "acst", label: "Australian Central Standard Time" },
				{ value: "aest", label: "Australian Eastern Standard Time" },
				{ value: "nzst", label: "New Zealand Standard Time" },
				{ value: "fjt", label: "Fiji Time" },
			],
		},
		{
			label: "South America",
			items: [
				{ value: "art", label: "Argentina Time" },
				{ value: "bot", label: "Bolivia Time" },
				{ value: "brt", label: "Brasilia Time" },
				{ value: "clt", label: "Chile Standard Time" },
			],
		},
	];

	const allTimezoneItems = timezoneGroups.flatMap((g) => g.items);

	const { Story } = defineMeta({
		title: "UI/Select",
		component: Select.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let alignValue = $state("banana");
	let alignItemWithTrigger = $state(true);
	const alignTriggerContent = $derived(
		fruits.find((f) => f.value === alignValue)?.label ?? "Select a fruit"
	);

	let groupsValue = $state("");
	const groupsTriggerContent = $derived(
		allGroupItems.find((f) => f.value === groupsValue)?.label ?? "Select a fruit"
	);

	let scrollableValue = $state("");
	const scrollableTriggerContent = $derived(
		allTimezoneItems.find((f) => f.value === scrollableValue)?.label ?? "Select a timezone"
	);

	let invalidValue = $state("");
	const invalidTriggerContent = $derived(
		fruits.find((f) => f.value === invalidValue)?.label ?? "Select a fruit"
	);
</script>

<Story name="Align Item With Trigger">
	{#snippet template()}
		<div class="w-full max-w-xs space-y-4">
			<Field.Field orientation="horizontal">
				<Field.Content>
					<Field.Label for="align-item">Align Item</Field.Label>
					<Field.Description>Toggle to align the item with the trigger.</Field.Description>
				</Field.Content>
				<Switch id="align-item" bind:checked={alignItemWithTrigger} />
			</Field.Field>
			<Select.Root type="single" bind:value={alignValue}>
				<Select.Trigger class="w-full">
					<span data-slot="select-value">{alignTriggerContent}</span>
				</Select.Trigger>
				<Select.Content position={alignItemWithTrigger ? "item-aligned" : "popper"}>
					<Select.Group>
						{#each fruits as fruit (fruit.value)}
							<Select.Item value={fruit.value} label={fruit.label}>
								{fruit.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	{/snippet}
</Story>

<Story name="Groups">
	{#snippet template()}
		<Select.Root type="single" bind:value={groupsValue}>
			<Select.Trigger class="w-full max-w-48">
				<span data-slot="select-value">{groupsTriggerContent}</span>
			</Select.Trigger>
			<Select.Content>
				{#each fruitGroups as group, i (group.label)}
					<Select.Group>
						<Select.GroupHeading>{group.label}</Select.GroupHeading>
						{#each group.items as item (item.value)}
							<Select.Item value={item.value} label={item.label}>
								{item.label}
							</Select.Item>
						{/each}
					</Select.Group>
					{#if i < fruitGroups.length - 1}
						<Select.Separator />
					{/if}
				{/each}
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Scrollable">
	{#snippet template()}
		<Select.Root type="single" bind:value={scrollableValue}>
			<Select.Trigger class="w-full max-w-64">
				<span data-slot="select-value">{scrollableTriggerContent}</span>
			</Select.Trigger>
			<Select.Content>
				{#each timezoneGroups as group (group.label)}
					<Select.Group>
						<Select.GroupHeading>{group.label}</Select.GroupHeading>
						{#each group.items as item (item.value)}
							<Select.Item value={item.value} label={item.label}>
								{item.label}
							</Select.Item>
						{/each}
					</Select.Group>
				{/each}
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Select.Root type="single" disabled>
			<Select.Trigger class="w-full max-w-48">
				<span data-slot="select-value">Select a fruit</span>
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each fruits as fruit (fruit.value)}
						<Select.Item value={fruit.value} label={fruit.label} disabled={fruit.value === "grapes"}>
							{fruit.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field class="w-full max-w-48" data-invalid="true">
			<Field.Label>Fruit</Field.Label>
			<Select.Root type="single" bind:value={invalidValue}>
				<Select.Trigger aria-invalid="true">
					<span data-slot="select-value">{invalidTriggerContent}</span>
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each fruits.slice(0, 3) as fruit (fruit.value)}
							<Select.Item value={fruit.value} label={fruit.label}>
								{fruit.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Field.Error>Please select a fruit.</Field.Error>
		</Field.Field>
	{/snippet}
</Story>
