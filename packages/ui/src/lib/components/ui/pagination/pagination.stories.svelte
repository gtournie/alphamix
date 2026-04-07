<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Pagination from "$lib/components/ui/pagination/index.js";

	const { Story } = defineMeta({
		title: "UI/Pagination",
		component: Pagination.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Simple">
	{#snippet template()}
		<Pagination.Root count={50} perPage={10} siblingCount={2} page={2}>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous />
					</Pagination.Item>
					{#each pages as pageItem (pageItem.key)}
						{#if pageItem.type === "ellipsis"}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link page={pageItem} isActive={currentPage === pageItem.value}>
									{pageItem.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.Next />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/snippet}
</Story>

<Story name="Icons Only">
	{#snippet template()}
		<Pagination.Root count={100} perPage={10} page={5}>
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
	{/snippet}
</Story>
