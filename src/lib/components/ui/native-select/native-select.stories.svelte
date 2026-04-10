<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import {
		NativeSelect,
		NativeSelectOptGroup,
		NativeSelectOption,
	} from "$lib/components/ui/native-select/index.js";

	const { Story } = defineMeta({
		title: "UI/NativeSelect",
		component: NativeSelect,
		tags: ["autodocs"],
	});

	const departments = [
		{
			group: "Engineering",
			items: [
				{ value: "frontend", label: "Frontend" },
				{ value: "backend", label: "Backend" },
				{ value: "devops", label: "DevOps" },
			],
		},
		{
			group: "Sales",
			items: [
				{ value: "sales-rep", label: "Sales Rep" },
				{ value: "account-manager", label: "Account Manager" },
				{ value: "sales-director", label: "Sales Director" },
			],
		},
		{
			group: "Operations",
			items: [
				{ value: "support", label: "Customer Support" },
				{ value: "product-manager", label: "Product Manager" },
				{ value: "ops-manager", label: "Operations Manager" },
			],
		},
	];

	const fruits = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "blueberry", label: "Blueberry" },
	];
</script>

<Story name="Groups">
	{#snippet template()}
		<NativeSelect aria-label="Department">
			<NativeSelectOption value="">Select department</NativeSelectOption>
			{#each departments as dept (dept.group)}
				<NativeSelectOptGroup label={dept.group}>
					{#each dept.items as item (item.value)}
						<NativeSelectOption value={item.value}>{item.label}</NativeSelectOption>
					{/each}
				</NativeSelectOptGroup>
			{/each}
		</NativeSelect>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<NativeSelect disabled aria-label="Fruit (disabled)">
			<NativeSelectOption value="">Disabled</NativeSelectOption>
			{#each fruits as fruit (fruit.value)}
				<NativeSelectOption value={fruit.value}>{fruit.label}</NativeSelectOption>
			{/each}
		</NativeSelect>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<NativeSelect aria-invalid="true" aria-label="Fruit">
			<NativeSelectOption value="">Error state</NativeSelectOption>
			{#each fruits as fruit (fruit.value)}
				<NativeSelectOption value={fruit.value}>{fruit.label}</NativeSelectOption>
			{/each}
		</NativeSelect>
	{/snippet}
</Story>
