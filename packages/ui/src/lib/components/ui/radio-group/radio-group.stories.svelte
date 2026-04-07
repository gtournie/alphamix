<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	const plans = [
		{ value: "plus", label: "Plus", description: "For individuals and small teams." },
		{ value: "pro", label: "Pro", description: "For growing teams and businesses." },
		{ value: "enterprise", label: "Enterprise", description: "For large organizations." },
	];

	const sizes = [
		{ value: "sm", label: "Small" },
		{ value: "md", label: "Medium" },
		{ value: "lg", label: "Large" },
		{ value: "xl", label: "X-Large" },
	];

	const { Story } = defineMeta({
		title: "UI/RadioGroup",
		component: RadioGroup.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<RadioGroup.Root value="comfortable">
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="default" id="r-default" />
				<Field.Label for="r-default">Default</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="comfortable" id="r-comfortable" />
				<Field.Label for="r-comfortable">Comfortable</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="compact" id="r-compact" />
				<Field.Label for="r-compact">Compact</Field.Label>
			</Field.Field>
		</RadioGroup.Root>
	{/snippet}
</Story>

<Story name="With Descriptions">
	{#snippet template()}
		<RadioGroup.Root value="pro">
			{#each plans as plan (plan.value)}
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value={plan.value} id="plan-{plan.value}" />
					<Field.Content>
						<Field.Label for="plan-{plan.value}">{plan.label}</Field.Label>
						<Field.Description>{plan.description}</Field.Description>
					</Field.Content>
				</Field.Field>
			{/each}
		</RadioGroup.Root>
	{/snippet}
</Story>

<Story name="Fieldset">
	{#snippet template()}
		<Field.Set>
			<Field.Legend>Battery level</Field.Legend>
			<Field.Description>Choose your preferred battery level.</Field.Description>
			<RadioGroup.Root value="medium">
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="low" id="bat-low" />
					<Field.Label for="bat-low">Low</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="medium" id="bat-medium" />
					<Field.Label for="bat-medium">Medium</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="high" id="bat-high" />
					<Field.Label for="bat-high">High</Field.Label>
				</Field.Field>
			</RadioGroup.Root>
		</Field.Set>
	{/snippet}
</Story>

<Story name="Grid">
	{#snippet template()}
		<RadioGroup.Root value="md" class="grid grid-cols-2 gap-2">
			{#each sizes as size (size.value)}
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value={size.value} id="size-{size.value}" />
					<Field.Label for="size-{size.value}">{size.label}</Field.Label>
				</Field.Field>
			{/each}
		</RadioGroup.Root>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<RadioGroup.Root value="comfortable" disabled>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="default" id="dis-default" />
				<Field.Label for="dis-default">Default</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="comfortable" id="dis-comfortable" />
				<Field.Label for="dis-comfortable">Comfortable</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="compact" id="dis-compact" />
				<Field.Label for="dis-compact">Compact</Field.Label>
			</Field.Field>
		</RadioGroup.Root>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Set data-invalid="true">
			<Field.Legend>Notifications</Field.Legend>
			<Field.Description>How should we notify you?</Field.Description>
			<RadioGroup.Root aria-invalid="true">
				<Field.Field orientation="horizontal" data-invalid="true">
					<RadioGroup.Item value="all" id="notif-all" />
					<Field.Label for="notif-all">All new messages</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal" data-invalid="true">
					<RadioGroup.Item value="direct" id="notif-direct" />
					<Field.Label for="notif-direct">Direct messages only</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal" data-invalid="true">
					<RadioGroup.Item value="none" id="notif-none" />
					<Field.Label for="notif-none">Nothing</Field.Label>
				</Field.Field>
			</RadioGroup.Root>
			<Field.Error>Please select a notification preference.</Field.Error>
		</Field.Set>
	{/snippet}
</Story>
