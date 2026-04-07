<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	const timezones = [
		{ group: "North America", items: ["Eastern (UTC-5)", "Central (UTC-6)", "Mountain (UTC-7)", "Pacific (UTC-8)"] },
		{ group: "Europe", items: ["London (UTC+0)", "Paris (UTC+1)", "Berlin (UTC+1)", "Rome (UTC+1)"] },
		{ group: "Asia/Pacific", items: ["Tokyo (UTC+9)", "Shanghai (UTC+8)", "Singapore (UTC+8)", "Sydney (UTC+11)"] },
	];

	const fruits = Array.from({ length: 50 }, (_, i) => `Fruit ${i + 1}`);

	const { Story } = defineMeta({
		title: "UI/Select",
		component: Select.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Align Item With Trigger">
	{#snippet template()}
		<Select.Root type="single">
			<Select.Trigger class="w-52">Select a fruit</Select.Trigger>
			<Select.Content>
				<Select.Item value="apple">Apple</Select.Item>
				<Select.Item value="banana">Banana</Select.Item>
				<Select.Item value="blueberry">Blueberry</Select.Item>
				<Select.Item value="grapes">Grapes</Select.Item>
				<Select.Item value="pineapple">Pineapple</Select.Item>
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Groups">
	{#snippet template()}
		<Select.Root type="single">
			<Select.Trigger class="w-64">Select a timezone</Select.Trigger>
			<Select.Content>
				{#each timezones as tz (tz.group)}
					<Select.Group>
						<Select.GroupHeading>{tz.group}</Select.GroupHeading>
						{#each tz.items as item (item)}
							<Select.Item value={item}>{item}</Select.Item>
						{/each}
					</Select.Group>
					<Select.Separator />
				{/each}
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Scrollable">
	{#snippet template()}
		<Select.Root type="single">
			<Select.Trigger class="w-52">Select a fruit</Select.Trigger>
			<Select.Content>
				{#each fruits as fruit (fruit)}
					<Select.Item value={fruit.toLowerCase().replace(" ", "-")}>{fruit}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Select.Root type="single" disabled>
			<Select.Trigger class="w-52">Select a fruit</Select.Trigger>
			<Select.Content>
				<Select.Item value="apple">Apple</Select.Item>
				<Select.Item value="banana">Banana</Select.Item>
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field class="max-w-sm" data-invalid="true">
			<Field.Label>Fruit</Field.Label>
			<Select.Root type="single">
				<Select.Trigger aria-invalid="true" class="w-full">Select a fruit</Select.Trigger>
				<Select.Content>
					<Select.Item value="apple">Apple</Select.Item>
					<Select.Item value="banana">Banana</Select.Item>
					<Select.Item value="blueberry">Blueberry</Select.Item>
				</Select.Content>
			</Select.Root>
			<Field.Error>Please select a fruit.</Field.Error>
		</Field.Field>
	{/snippet}
</Story>
