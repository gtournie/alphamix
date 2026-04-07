<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Spinner } from "$lib/components/ui/spinner/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Empty from "$lib/components/ui/empty/index.js";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";

	const { Story } = defineMeta({
		title: "UI/Spinner",
		component: Spinner,
		tags: ["autodocs"],
	});
</script>

<Story name="Size">
	{#snippet template()}
		<div class="flex items-center gap-6">
			<Spinner class="size-3" />
			<Spinner class="size-4" />
			<Spinner class="size-6" />
			<Spinner class="size-8" />
		</div>
	{/snippet}
</Story>

<Story name="Button">
	{#snippet template()}
		<div class="flex flex-col items-center gap-4">
			<Button disabled size="sm">
				<Spinner data-icon="inline-start" />
				Loading...
			</Button>
			<Button variant="outline" disabled size="sm">
				<Spinner data-icon="inline-start" />
				Please wait
			</Button>
			<Button variant="secondary" disabled size="sm">
				<Spinner data-icon="inline-start" />
				Processing
			</Button>
		</div>
	{/snippet}
</Story>

<Story name="Badge">
	{#snippet template()}
		<div class="flex items-center gap-4 [--radius:1.2rem]">
			<Badge>
				<Spinner data-icon="inline-start" />
				Syncing
			</Badge>
			<Badge variant="secondary">
				<Spinner data-icon="inline-start" />
				Updating
			</Badge>
			<Badge variant="outline">
				<Spinner data-icon="inline-start" />
				Processing
			</Badge>
		</div>
	{/snippet}
</Story>

<Story name="Input Group">
	{#snippet template()}
		<div class="flex w-full max-w-md flex-col gap-4">
			<InputGroup.Root>
				<InputGroup.Input placeholder="Send a message..." disabled />
				<InputGroup.Addon align="inline-end">
					<Spinner />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Textarea placeholder="Send a message..." disabled />
				<InputGroup.Addon align="block-end">
					<Spinner /> Validating...
					<InputGroup.Button class="ml-auto" variant="default">
						<ArrowUpIcon />
						<span class="sr-only">Send</span>
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Empty">
	{#snippet template()}
		<Empty.Root class="w-full">
			<Empty.Header>
				<Empty.Media variant="icon">
					<Spinner />
				</Empty.Media>
				<Empty.Title>Processing your request</Empty.Title>
				<Empty.Description>
					Please wait while we process your request. Do not refresh the page.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" size="sm">Cancel</Button>
			</Empty.Content>
		</Empty.Root>
	{/snippet}
</Story>
