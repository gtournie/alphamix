<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import {
		Field,
		FieldContent,
		FieldDescription,
		FieldLabel,
	} from "$lib/components/ui/field/index.js";
	import * as Table from "$lib/components/ui/table/index.js";

	const { Story } = defineMeta({
		title: "UI/Checkbox",
		component: Checkbox,
		tags: ["autodocs"],
		argTypes: {
			checked: { control: "boolean" },
			indeterminate: { control: "boolean" },
			disabled: { control: "boolean" },
		},
	});
</script>

<script>
	const tableData = [
		{
			id: "1",
			name: "Sarah Chen",
			email: "sarah.chen@example.com",
			role: "Admin",
		},
		{
			id: "2",
			name: "Marcus Rodriguez",
			email: "marcus.rodriguez@example.com",
			role: "User",
		},
		{
			id: "3",
			name: "Priya Patel",
			email: "priya.patel@example.com",
			role: "User",
		},
		{
			id: "4",
			name: "David Kim",
			email: "david.kim@example.com",
			role: "Editor",
		},
	];

	let selectedRows = $state(new Set(["1"]));
	const isIndeterminate = $derived(
		selectedRows.size > 0 && selectedRows.size < tableData.length,
	);

	function handleSelectAll(checked) {
		selectedRows = checked ? new Set(tableData.map((r) => r.id)) : new Set();
	}

	function handleSelectRow(id, checked) {
		const next = new Set(selectedRows);
		if (checked) next.add(id);
		else next.delete(id);
		selectedRows = next;
	}
</script>

<Story name="Basic" args={{ checked: false, disabled: false }}>
	{#snippet template(args)}
		<Field orientation="horizontal">
			<Checkbox id="terms" {...args} />
			<FieldLabel for="terms">Accept terms and conditions</FieldLabel>
		</Field>
	{/snippet}
</Story>

<Story name="Description">
	{#snippet template()}
		<Field orientation="horizontal">
			<Checkbox id="terms-2" checked />
			<FieldContent>
				<FieldLabel for="terms-2">Accept terms and conditions</FieldLabel>
				<FieldDescription>
					By clicking this checkbox, you agree to the terms and conditions.
				</FieldDescription>
			</FieldContent>
		</Field>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Field orientation="horizontal">
			<Checkbox id="toggle" disabled />
			<FieldLabel for="toggle">Enable notifications</FieldLabel>
		</Field>
	{/snippet}
</Story>

<Story name="Group">
	{#snippet template()}
		<Field>
			<FieldLabel>Show these items on the desktop:</FieldLabel>
			<Field orientation="horizontal">
				<Checkbox id="hard-disks" checked />
				<FieldLabel for="hard-disks" class="font-normal">Hard disks</FieldLabel>
			</Field>
			<Field orientation="horizontal">
				<Checkbox id="external-disks" checked />
				<FieldLabel for="external-disks" class="font-normal"
					>External disks</FieldLabel
				>
			</Field>
			<Field orientation="horizontal">
				<Checkbox id="cds-dvds" />
				<FieldLabel for="cds-dvds" class="font-normal"
					>CDs, DVDs, and iPods</FieldLabel
				>
			</Field>
			<Field orientation="horizontal">
				<Checkbox id="connected-servers" />
				<FieldLabel for="connected-servers" class="font-normal"
					>Connected servers</FieldLabel
				>
			</Field>
		</Field>
	{/snippet}
</Story>

<Story name="Table">
	{#snippet template()}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-8">
						<Checkbox
							id="select-all"
							checked={selectedRows.size === tableData.length}
							indeterminate={isIndeterminate}
							onCheckedChange={handleSelectAll}
						/>
					</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Role</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each tableData as row (row.id)}
					<Table.Row
						data-state={selectedRows.has(row.id) ? "selected" : undefined}
					>
						<Table.Cell>
							<Checkbox
								id="row-{row.id}"
								checked={selectedRows.has(row.id)}
								onCheckedChange={(checked) =>
									handleSelectRow(row.id, checked === true)}
							/>
						</Table.Cell>
						<Table.Cell class="font-medium">{row.name}</Table.Cell>
						<Table.Cell>{row.email}</Table.Cell>
						<Table.Cell>{row.role}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/snippet}
</Story>
