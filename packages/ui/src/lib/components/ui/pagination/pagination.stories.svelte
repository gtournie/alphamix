<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as Select from "$lib/components/ui/select/index.js";

	const { Story } = defineMeta({
		title: "UI/Pagination",
		component: Pagination.Root,
		tags: ["autodocs"],
	});
</script>

<script lang="ts">
	let rowsPerPage = $state("25");
</script>

<Story name="Simple">
	{#snippet template()}
		<Pagination.Root count={5} perPage={1} page={2}>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					{#each pages as pageItem (pageItem.key)}
						{#if pageItem.type === "ellipsis"}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link
									page={pageItem}
									isActive={currentPage === pageItem.value}
								>
									{pageItem.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/snippet}
</Story>

<Story name="Icons Only">
	{#snippet template()}
		<div class="flex items-center gap-4">
			<Field.Field orientation="horizontal" class="w-fit">
				<Field.Label for="select-rows-per-page">Rows per page</Field.Label>
				<Select.Root type="single" bind:value={rowsPerPage}>
					<Select.Trigger class="w-20" id="select-rows-per-page">
						{rowsPerPage}
					</Select.Trigger>
					<Select.Content align="start">
						<Select.Group>
							<Select.Item value="10">10</Select.Item>
							<Select.Item value="25">25</Select.Item>
							<Select.Item value="50">50</Select.Item>
							<Select.Item value="100">100</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
			<Pagination.Root count={100} perPage={10} page={5} class="mx-0 w-auto">
				{#snippet children()}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous />
						</Pagination.Item>
						<Pagination.Item>
							<Pagination.Next />
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</div>
	{/snippet}
</Story>
