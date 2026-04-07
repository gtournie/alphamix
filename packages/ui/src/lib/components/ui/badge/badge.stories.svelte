<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import BookmarkIcon from "@lucide/svelte/icons/bookmark";
	import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";

	const { Story } = defineMeta({
		title: "UI/Badge",
		component: Badge,
		tags: ["autodocs"],
		argTypes: {
			variant: {
				control: "select",
				options: [
					"default",
					"secondary",
					"destructive",
					"outline",
					"ghost",
					"link",
				],
			},
		},
	});
</script>

<Story name="Variants">
	{#snippet template()}
		<div class="flex flex-wrap gap-2">
			<Badge>Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="ghost">Ghost</Badge>
			<Badge variant="link">Link</Badge>
		</div>
	{/snippet}
</Story>

<Story name="With Icon">
	{#snippet template()}
		<div class="flex flex-wrap gap-2">
			<Badge>
				<BadgeCheckIcon data-icon="inline-start" />
				Verified
			</Badge>
			<Badge variant="secondary">
				<BookmarkIcon data-icon="inline-start" />
				Saved
			</Badge>
		</div>
	{/snippet}
</Story>

<Story name="With Spinner">
	{#snippet template()}
		<div class="flex flex-wrap gap-2">
			<Badge variant="destructive">
				<LoaderCircleIcon data-icon="inline-start" class="animate-spin" />
				Deleting
			</Badge>
			<Badge variant="secondary">
				Generating
				<LoaderCircleIcon data-icon="inline-end" class="animate-spin" />
			</Badge>
		</div>
	{/snippet}
</Story>

<Story name="Link">
	{#snippet template()}
		<Badge href="#">
			Visit page
			<ArrowUpRightIcon data-icon="inline-end" />
		</Badge>
	{/snippet}
</Story>

<Story name="Custom Colors">
	{#snippet template()}
		<div class="flex flex-wrap gap-2">
			<Badge class="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</Badge>
			<Badge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Green</Badge>
			<Badge class="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</Badge>
			<Badge class="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Purple</Badge>
			<Badge class="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</Badge>
		</div>
	{/snippet}
</Story>
