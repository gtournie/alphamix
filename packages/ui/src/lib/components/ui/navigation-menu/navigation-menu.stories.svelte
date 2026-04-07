<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";

	const components = [
		{
			title: "Alert Dialog",
			href: "/docs/components/alert-dialog",
			description:
				"A modal dialog that interrupts the user with important content and expects a response.",
		},
		{
			title: "Hover Card",
			href: "/docs/components/hover-card",
			description: "For sighted users to preview content available behind a link.",
		},
		{
			title: "Progress",
			href: "/docs/components/progress",
			description:
				"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
		},
		{
			title: "Scroll Area",
			href: "/docs/components/scroll-area",
			description: "Visually or semantically separates content.",
		},
		{
			title: "Tabs",
			href: "/docs/components/tabs",
			description:
				"A set of layered sections of content known as tab panels that are displayed one at a time.",
		},
		{
			title: "Tooltip",
			href: "/docs/components/tooltip",
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
						<ul class="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li class="row-span-3">
								<NavigationMenu.Link
									href="/"
									class="from-muted/50 to-muted flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-none focus:shadow-md"
								>
									<div class="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
									<p class="text-muted-foreground text-sm leading-tight">
										Beautifully designed components built with Tailwind CSS.
									</p>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="/docs">
									<div class="text-sm leading-none font-medium">Introduction</div>
									<p class="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
										Re-usable components built using Bits UI and Tailwind CSS.
									</p>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="/docs/installation">
									<div class="text-sm leading-none font-medium">Installation</div>
									<p class="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
										How to install dependencies and structure your app.
									</p>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="/docs/components/typography">
									<div class="text-sm leading-none font-medium">Typography</div>
									<p class="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
										Styles for headings, paragraphs, lists…
									</p>
								</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{#each components as component (component.title)}
								<li>
									<NavigationMenu.Link href={component.href}>
										<div class="text-sm leading-none font-medium">{component.title}</div>
										<p class="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
											{component.description}
										</p>
									</NavigationMenu.Link>
								</li>
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	{/snippet}
</Story>

<Story name="Without Viewport">
	{#snippet template()}
		<NavigationMenu.Root viewport={false}>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-48 gap-2 p-3">
							<li>
								<NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="/components">Components</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="/examples">Examples</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/">Home</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	{/snippet}
</Story>

<Story name="Simple Links">
	{#snippet template()}
		<NavigationMenu.Root viewport={false}>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/">Home</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/about">About</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/blog">Blog</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	{/snippet}
</Story>
