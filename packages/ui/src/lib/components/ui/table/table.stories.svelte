<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Table from "$lib/components/ui/table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";

	const invoices = [
		{ invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
		{ invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
		{ invoice: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
		{ invoice: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
		{ invoice: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
		{ invoice: "INV006", status: "Pending", method: "Bank Transfer", amount: "$200.00" },
		{ invoice: "INV007", status: "Unpaid", method: "Credit Card", amount: "$300.00" },
	];

	const products = [
		{ name: "Wireless Mouse", price: "$29.99" },
		{ name: "Mechanical Keyboard", price: "$129.99" },
		{ name: "USB-C Hub", price: "$49.99" },
	];

	const { Story } = defineMeta({
		title: "UI/Table",
		component: Table.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Footer">
	{#snippet template()}
		<Table.Root>
			<Table.Caption>A list of your recent invoices.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Invoice</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Method</Table.Head>
					<Table.Head class="text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each invoices as invoice (invoice.invoice)}
					<Table.Row>
						<Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
						<Table.Cell>{invoice.status}</Table.Cell>
						<Table.Cell>{invoice.method}</Table.Cell>
						<Table.Cell class="text-right">{invoice.amount}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colspan={3}>Total</Table.Cell>
					<Table.Cell class="text-right">$2,500.00</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	{/snippet}
</Story>

<Story name="Actions">
	{#snippet template()}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Product</Table.Head>
					<Table.Head>Price</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each products as product (product.name)}
					<Table.Row>
						<Table.Cell class="font-medium">{product.name}</Table.Cell>
						<Table.Cell>{product.price}</Table.Cell>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button variant="ghost" size="icon" class="size-8" {...props}>
											<MoreHorizontalIcon />
											<span class="sr-only">Open menu</span>
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item>Edit</DropdownMenu.Item>
									<DropdownMenu.Item>Duplicate</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item variant="destructive">Delete</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/snippet}
</Story>
