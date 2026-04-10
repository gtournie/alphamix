<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	const { Story } = defineMeta({
		title: "UI/Card",
		component: Card.Root,
		tags: ["autodocs"],
		argTypes: {},
	});
</script>

<Story name="Size">
	{#snippet template()}
		<Card.Root size="sm" class="mx-auto w-full max-w-sm">
			<Card.Header>
				<Card.Title>Small Card</Card.Title>
				<Card.Description>
					This card uses the small size variant.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>
					The card component supports a size prop that can be set to
					"sm" for a more compact appearance.
				</p>
			</Card.Content>
			<Card.Footer>
				<Button variant="outline" size="sm" class="w-full">
					Action
				</Button>
			</Card.Footer>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Image">
	{#snippet template()}
		<Card.Root class="relative mx-auto w-full max-w-sm pt-0">
			<div class="absolute inset-0 z-30 aspect-video bg-black/35"></div>
			<img
				src="https://avatar.vercel.sh/shadcn1"
				alt="Event cover"
				class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
			/>
			<Card.Header>
				<Card.Action>
					<Badge variant="secondary">Featured</Badge>
				</Card.Action>
				<Card.Title>Design systems meetup</Card.Title>
				<Card.Description>
					A practical talk on component APIs, accessibility, and shipping
					faster.
				</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button class="w-full">View Event</Button>
			</Card.Footer>
		</Card.Root>
	{/snippet}
</Story>
