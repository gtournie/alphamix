<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import * as Card from "$lib/components/ui/card/index.js";

	const { Story } = defineMeta({
		title: "UI/Carousel",
		component: Carousel.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Sizes">
	{#snippet template()}
		<div class="flex justify-center px-12">
			<Carousel.Root
				opts={{ align: "start" }}
				class="w-full max-w-48 sm:max-w-xs md:max-w-sm"
			>
				<Carousel.Content>
					{#each Array.from({ length: 5 }, (_, i) => i + 1) as item (item)}
						<Carousel.Item class="basis-1/2 lg:basis-1/3">
							<div class="p-1">
								<Card.Root>
									<Card.Content
										class="flex aspect-square items-center justify-center p-6"
									>
										<span class="text-3xl font-semibold">{item}</span>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
	{/snippet}
</Story>

<Story name="Spacing">
	{#snippet template()}
		<div class="flex justify-center px-12">
			<Carousel.Root class="w-full max-w-48 sm:max-w-xs md:max-w-sm">
				<Carousel.Content class="-ml-1">
					{#each Array.from({ length: 5 }, (_, i) => i + 1) as item (item)}
						<Carousel.Item class="basis-1/2 pl-1 lg:basis-1/3">
							<div class="p-1">
								<Card.Root>
									<Card.Content
										class="flex aspect-square items-center justify-center p-6"
									>
										<span class="text-2xl font-semibold">{item}</span>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
	{/snippet}
</Story>

<Story name="Orientation">
	{#snippet template()}
		<div class="flex justify-center py-16">
			<Carousel.Root
				opts={{ align: "start" }}
				orientation="vertical"
				class="w-full max-w-xs"
			>
				<Carousel.Content class="h-full -mt-1" viewportClass="h-67.5">
					{#each Array.from({ length: 5 }, (_, i) => i + 1) as item (item)}
						<Carousel.Item class="basis-1/2 pt-1">
							<div class="p-1">
								<Card.Root>
									<Card.Content class="flex items-center justify-center p-7">
										<span class="text-3xl font-semibold">{item}</span>
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
	{/snippet}
</Story>
