<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";

	const components = [
		{
			title: "Alert Dialog",
			href: "/docs/primitives/alert-dialog",
			description:
				"A modal dialog that interrupts the user with important content and expects a response.",
		},
		{
			title: "Hover Card",
			href: "/docs/primitives/hover-card",
			description:
				"For sighted users to preview content available behind a link.",
		},
		{
			title: "Progress",
			href: "/docs/primitives/progress",
			description:
				"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
		},
		{
			title: "Scroll-area",
			href: "/docs/primitives/scroll-area",
			description: "Augments native scroll functionality for custom, cross-browser styling.",
		},
		{
			title: "Tabs",
			href: "/docs/primitives/tabs",
			description:
				"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
		},
		{
			title: "Tooltip",
			href: "/docs/primitives/tooltip",
			description:
				"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
		},
	];

	const { Story } = defineMeta({
		title: "UI/NavigationMenu",
		component: NavigationMenu.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Default">
	{#snippet template()}
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Getting started</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="w-96 p-2">
							<li>
								<NavigationMenu.Link href="/docs">
									<div class="space-y-1">
										<div class="text-sm leading-none font-medium">Introduction</div>
										<p class="text-muted-foreground line-clamp-2 text-sm/snug ">
											Re-usable components built with Tailwind CSS.
										</p>
									</div>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="/docs/installation">
									<div class="space-y-1">
										<div class="text-sm leading-none font-medium">Installation</div>
										<p class="text-muted-foreground line-clamp-2 text-sm/snug ">
											How to install dependencies and structure your app.
										</p>
									</div>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="/docs/primitives/typography">
									<div class="space-y-1">
										<div class="text-sm leading-none font-medium">Typography</div>
										<p class="text-muted-foreground line-clamp-2 text-sm/snug ">
											Styles for headings, paragraphs, lists...etc
										</p>
									</div>
								</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item class="hidden md:flex">
					<NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{#each components as component (component.title)}
								<li>
									<NavigationMenu.Link href={component.href}>
										<div class="space-y-1">
											<div class="text-sm leading-none font-medium">
												{component.title}
											</div>
											<p class="text-muted-foreground line-clamp-2 text-sm/snug ">
												{component.description}
											</p>
										</div>
									</NavigationMenu.Link>
								</li>
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	{/snippet}
</Story>
