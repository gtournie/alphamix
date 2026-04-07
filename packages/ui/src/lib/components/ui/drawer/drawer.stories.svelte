<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { cn } from "$lib/utils.js";

	const sides = /** @type {const} */ (["top", "right", "bottom", "left"]);

	const { Story } = defineMeta({
		title: "UI/Drawer",
		component: Drawer.Root,
		tags: ["autodocs"],
		argTypes: {
			direction: {
				control: "select",
				options: ["top", "right", "bottom", "left"],
			},
			shouldScaleBackground: { control: "boolean" },
		},
	});
</script>

<script>
	let scrollableOpen = $state(false);

	let sidesOpen = $state(/** @type {Record<string, boolean>} */ ({}));

	let responsiveOpen = $state(false);
	let isDesktop = $state(false);

	$effect(() => {
		if (typeof window === "undefined") return;
		const mq = window.matchMedia("(min-width: 768px)");
		isDesktop = mq.matches;
		const handler = (/** @type {MediaQueryListEvent} */ e) =>
			(isDesktop = e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	});
</script>

<Story name="Scrollable Content">
	{#snippet template()}
		<Drawer.Root bind:open={scrollableOpen} direction="right">
			<Drawer.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Scrollable Content</Button>
				{/snippet}
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Move Goal</Drawer.Title>
					<Drawer.Description>Set your daily activity goal.</Drawer.Description>
				</Drawer.Header>
				<div class="no-scrollbar overflow-y-auto px-4">
					{#each Array.from({ length: 10 }) as _}
						<p class="mb-4 leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					{/each}
				</div>
				<Drawer.Footer>
					<Button>Submit</Button>
					<Drawer.Close>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>Cancel</Button>
						{/snippet}
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	{/snippet}
</Story>

<Story name="Sides">
	{#snippet template()}
		<div class="flex flex-wrap gap-2">
			{#each sides as side}
				<Drawer.Root
					direction={side === "bottom" ? undefined : side}
					open={sidesOpen[side]}
					onOpenChange={(v) => (sidesOpen[side] = v)}
				>
					<Drawer.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" class="capitalize" {...props}
								>{side}</Button
							>
						{/snippet}
					</Drawer.Trigger>
					<Drawer.Content
						class="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]"
					>
						<Drawer.Header>
							<Drawer.Title>Move Goal</Drawer.Title>
							<Drawer.Description
								>Set your daily activity goal.</Drawer.Description
							>
						</Drawer.Header>
						<div class="no-scrollbar overflow-y-auto px-4">
							{#each Array.from({ length: 10 }) as _}
								<p class="mb-4 leading-normal">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud exercitation ullamco
									laboris nisi ut aliquip ex ea commodo consequat. Duis aute
									irure dolor in reprehenderit in voluptate velit esse cillum
									dolore eu fugiat nulla pariatur. Excepteur sint occaecat
									cupidatat non proident, sunt in culpa qui officia deserunt
									mollit anim id est laborum.
								</p>
							{/each}
						</div>
						<Drawer.Footer>
							<Button>Submit</Button>
							<Drawer.Close>
								{#snippet child({ props })}
									<Button variant="outline" {...props}>Cancel</Button>
								{/snippet}
							</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Responsive Dialog">
	{#snippet template()}
		{#if isDesktop}
			<Dialog.Root bind:open={responsiveOpen}>
				<Dialog.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Edit Profile</Button>
					{/snippet}
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-106.25">
					<Dialog.Header>
						<Dialog.Title>Edit profile</Dialog.Title>
						<Dialog.Description>
							Make changes to your profile here. Click save when you're done.
						</Dialog.Description>
					</Dialog.Header>
					<form class="grid items-start gap-6">
						<div class="grid gap-3">
							<Label for="email-desktop">Email</Label>
							<Input
								type="email"
								id="email-desktop"
								value="shadcn@example.com"
							/>
						</div>
						<div class="grid gap-3">
							<Label for="username-desktop">Username</Label>
							<Input id="username-desktop" value="@shadcn" />
						</div>
						<Button type="submit">Save changes</Button>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		{:else}
			<Drawer.Root bind:open={responsiveOpen}>
				<Drawer.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Edit Profile</Button>
					{/snippet}
				</Drawer.Trigger>
				<Drawer.Content>
					<Drawer.Header class="text-left">
						<Drawer.Title>Edit profile</Drawer.Title>
						<Drawer.Description>
							Make changes to your profile here. Click save when you're done.
						</Drawer.Description>
					</Drawer.Header>
					<form class={cn("grid items-start gap-6", "px-4")}>
						<div class="grid gap-3">
							<Label for="email-mobile">Email</Label>
							<Input
								type="email"
								id="email-mobile"
								value="shadcn@example.com"
							/>
						</div>
						<div class="grid gap-3">
							<Label for="username-mobile">Username</Label>
							<Input id="username-mobile" value="@shadcn" />
						</div>
						<Button type="submit">Save changes</Button>
					</form>
					<Drawer.Footer class="pt-2">
						<Drawer.Close>
							{#snippet child({ props })}
								<Button variant="outline" {...props}>Cancel</Button>
							{/snippet}
						</Drawer.Close>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Root>
		{/if}
	{/snippet}
</Story>
