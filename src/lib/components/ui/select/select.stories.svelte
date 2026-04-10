<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";

	const fruitLabels: Record<string, string> = {
		apple: "Apple",
		banana: "Banana",
		blueberry: "Blueberry",
		grapes: "Grapes",
		pineapple: "Pineapple",
	};

	const groupItemLabels: Record<string, string> = {
		...fruitLabels,
		carrot: "Carrot",
		broccoli: "Broccoli",
		spinach: "Spinach",
	};

	const timezoneLabels: Record<string, string> = {
		est: "Eastern Standard Time",
		cst: "Central Standard Time",
		mst: "Mountain Standard Time",
		pst: "Pacific Standard Time",
		akst: "Alaska Standard Time",
		hst: "Hawaii Standard Time",
		gmt: "Greenwich Mean Time",
		cet: "Central European Time",
		eet: "Eastern European Time",
		west: "Western European Summer Time",
		cat: "Central Africa Time",
		eat: "East Africa Time",
		msk: "Moscow Time",
		ist: "India Standard Time",
		cst_china: "China Standard Time",
		jst: "Japan Standard Time",
		kst: "Korea Standard Time",
		ist_indonesia: "Indonesia Central Standard Time",
		awst: "Australian Western Standard Time",
		acst: "Australian Central Standard Time",
		aest: "Australian Eastern Standard Time",
		nzst: "New Zealand Standard Time",
		fjt: "Fiji Time",
		art: "Argentina Time",
		bot: "Bolivia Time",
		brt: "Brasilia Time",
		clt: "Chile Standard Time",
	};

	const { Story } = defineMeta({
		title: "UI/Select",
		component: Select.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let alignItemWithTrigger = $state(true);
	let alignFruit = $state("banana");
	let groupFruit = $state("");
	let timezone = $state("");
</script>

<Story name="Align Item With Trigger">
	{#snippet template()}
		<Field.Group class="w-full max-w-xs">
			<Field.Field orientation="horizontal">
				<Field.Content>
					<Field.Label for="align-item">Align Item</Field.Label>
					<Field.Description>
						Toggle to align the item with the trigger.
					</Field.Description>
				</Field.Content>
				<Switch id="align-item" bind:checked={alignItemWithTrigger} />
			</Field.Field>
			<Field.Field>
				<Select.Root type="single" bind:value={alignFruit}>
					<Select.Trigger>
						{fruitLabels[alignFruit] ?? "Select a fruit"}
					</Select.Trigger>
					<Select.Content position={alignItemWithTrigger ? "item-aligned" : "popper"}>
						<Select.Group>
							<Select.Item value="apple">Apple</Select.Item>
							<Select.Item value="banana">Banana</Select.Item>
							<Select.Item value="blueberry">Blueberry</Select.Item>
							<Select.Item value="grapes">Grapes</Select.Item>
							<Select.Item value="pineapple">Pineapple</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
		</Field.Group>
	{/snippet}
</Story>

<Story name="Groups">
	{#snippet template()}
		<Select.Root type="single" bind:value={groupFruit}>
			<Select.Trigger class="w-full max-w-48">
				{groupItemLabels[groupFruit] ?? "Select a fruit"}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Fruits</Select.Label>
					<Select.Item value="apple">Apple</Select.Item>
					<Select.Item value="banana">Banana</Select.Item>
					<Select.Item value="blueberry">Blueberry</Select.Item>
				</Select.Group>
				<Select.Separator />
				<Select.Group>
					<Select.Label>Vegetables</Select.Label>
					<Select.Item value="carrot">Carrot</Select.Item>
					<Select.Item value="broccoli">Broccoli</Select.Item>
					<Select.Item value="spinach">Spinach</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Scrollable">
	{#snippet template()}
		<Select.Root type="single" bind:value={timezone}>
			<Select.Trigger class="w-full max-w-64">
				{timezoneLabels[timezone] ?? "Select a timezone"}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>North America</Select.Label>
					<Select.Item value="est">Eastern Standard Time</Select.Item>
					<Select.Item value="cst">Central Standard Time</Select.Item>
					<Select.Item value="mst">Mountain Standard Time</Select.Item>
					<Select.Item value="pst">Pacific Standard Time</Select.Item>
					<Select.Item value="akst">Alaska Standard Time</Select.Item>
					<Select.Item value="hst">Hawaii Standard Time</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Europe & Africa</Select.Label>
					<Select.Item value="gmt">Greenwich Mean Time</Select.Item>
					<Select.Item value="cet">Central European Time</Select.Item>
					<Select.Item value="eet">Eastern European Time</Select.Item>
					<Select.Item value="west">Western European Summer Time</Select.Item>
					<Select.Item value="cat">Central Africa Time</Select.Item>
					<Select.Item value="eat">East Africa Time</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Asia</Select.Label>
					<Select.Item value="msk">Moscow Time</Select.Item>
					<Select.Item value="ist">India Standard Time</Select.Item>
					<Select.Item value="cst_china">China Standard Time</Select.Item>
					<Select.Item value="jst">Japan Standard Time</Select.Item>
					<Select.Item value="kst">Korea Standard Time</Select.Item>
					<Select.Item value="ist_indonesia">Indonesia Central Standard Time</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Australia & Pacific</Select.Label>
					<Select.Item value="awst">Australian Western Standard Time</Select.Item>
					<Select.Item value="acst">Australian Central Standard Time</Select.Item>
					<Select.Item value="aest">Australian Eastern Standard Time</Select.Item>
					<Select.Item value="nzst">New Zealand Standard Time</Select.Item>
					<Select.Item value="fjt">Fiji Time</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>South America</Select.Label>
					<Select.Item value="art">Argentina Time</Select.Item>
					<Select.Item value="bot">Bolivia Time</Select.Item>
					<Select.Item value="brt">Brasilia Time</Select.Item>
					<Select.Item value="clt">Chile Standard Time</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Select.Root type="single" disabled>
			<Select.Trigger class="w-full max-w-48">Select a fruit</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Item value="apple">Apple</Select.Item>
					<Select.Item value="banana">Banana</Select.Item>
					<Select.Item value="blueberry">Blueberry</Select.Item>
					<Select.Item value="grapes" disabled>Grapes</Select.Item>
					<Select.Item value="pineapple">Pineapple</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field data-invalid="true" class="w-full max-w-48">
			<Field.Label>Fruit</Field.Label>
			<Select.Root type="single">
				<Select.Trigger aria-invalid="true">Select a fruit</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="apple">Apple</Select.Item>
						<Select.Item value="banana">Banana</Select.Item>
						<Select.Item value="blueberry">Blueberry</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Field.Error>Please select a fruit.</Field.Error>
		</Field.Field>
	{/snippet}
</Story>
