<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import SidebarRoot from "$lib/components/ui/sidebar/sidebar.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import HomeIcon from "@lucide/svelte/icons/house";
	import InboxIcon from "@lucide/svelte/icons/inbox";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import SearchIcon from "@lucide/svelte/icons/search";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import UserIcon from "@lucide/svelte/icons/user";

	const navItems = [
		{ label: "Home", icon: HomeIcon, active: true },
		{ label: "Inbox", icon: InboxIcon, active: false },
		{ label: "Calendar", icon: CalendarIcon, active: false },
		{ label: "Search", icon: SearchIcon, active: false },
	];

	const { Story } = defineMeta({
		title: "UI/Sidebar",
		component: SidebarRoot,
		tags: ["autodocs"],
		argTypes: {
			side: { control: "select", options: ["left", "right"] },
			variant: { control: "select", options: ["sidebar", "floating", "inset"] },
			collapsible: {
				control: "select",
				options: ["offcanvas", "icon", "none"],
			},
		},
		args: {
			side: "left",
			variant: "sidebar",
			collapsible: "offcanvas",
		},
	});
</script>

<Story
	name="Basic"
	args={{ side: "left", variant: "sidebar", collapsible: "offcanvas" }}
>
	{#snippet template(args)}
		<Sidebar.Provider style="min-height: 400px; width: 100%;">
			<Sidebar.Root {...args}>
				<Sidebar.Header>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton size="lg">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<HomeIcon class="size-4" />
								</div>
								<div class="flex flex-col gap-0.5 leading-none">
									<span class="font-semibold">Acme Inc</span>
									<span class="text-xs">v1.0.0</span>
								</div>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each navItems as item}
									{@const Icon = item.icon}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton isActive={item.active}>
											<Icon />
											<span>{item.label}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										<SettingsIcon />
										<span>Settings</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
				<Sidebar.Footer>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton size="lg">
								<UserIcon class="size-8 rounded-lg" />
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-semibold">Jane Doe</span>
									<span class="truncate text-xs">jane@example.com</span>
								</div>
								<ChevronUpIcon class="ml-auto size-4" />
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Footer>
				<Sidebar.Rail />
			</Sidebar.Root>
			<Sidebar.Inset>
				<div class="flex flex-1 flex-col gap-4 p-4">
					<div class="flex items-center gap-2">
						<Sidebar.Trigger />
						<h1 class="text-lg font-semibold">Dashboard</h1>
					</div>
					<div class="grid auto-rows-min gap-4 md:grid-cols-3">
						{#each [1, 2, 3] as _}
							<div class="bg-muted/50 aspect-video rounded-xl"></div>
						{/each}
					</div>
					<div class="bg-muted/50 min-h-[200px] flex-1 rounded-xl"></div>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	{/snippet}
</Story>

<Story
	name="Collapsible Icon"
	args={{ side: "left", variant: "sidebar", collapsible: "icon" }}
>
	{#snippet template(args)}
		<Sidebar.Provider style="min-height: 400px; width: 100%;">
			<Sidebar.Root {...args}>
				<Sidebar.Header>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton size="lg" tooltipContent="Acme Inc">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<HomeIcon class="size-4" />
								</div>
								<div class="flex flex-col gap-0.5 leading-none">
									<span class="font-semibold">Acme Inc</span>
								</div>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each navItems as item}
									{@const Icon = item.icon}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											isActive={item.active}
											tooltipContent={item.label}
										>
											<Icon />
											<span>{item.label}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
				<Sidebar.Rail />
			</Sidebar.Root>
			<Sidebar.Inset>
				<div class="flex items-center gap-2 p-4">
					<Sidebar.Trigger />
					<span class="text-muted-foreground text-sm"
						>Toggle sidebar with the button or rail</span
					>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	{/snippet}
</Story>

<Story
	name="Floating"
	args={{ side: "left", variant: "floating", collapsible: "offcanvas" }}
>
	{#snippet template(args)}
		<Sidebar.Provider style="min-height: 400px; width: 100%;">
			<Sidebar.Root {...args}>
				<Sidebar.Header>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton size="lg">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<HomeIcon class="size-4" />
								</div>
								<div class="flex flex-col gap-0.5 leading-none">
									<span class="font-semibold">Acme Inc</span>
								</div>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each navItems as item}
									{@const Icon = item.icon}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton isActive={item.active}>
											<Icon />
											<span>{item.label}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
			<Sidebar.Inset>
				<div class="flex items-center gap-2 p-4">
					<Sidebar.Trigger />
					<span class="text-muted-foreground text-sm"
						>Floating sidebar variant</span
					>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	{/snippet}
</Story>

<Story
	name="Inset"
	args={{ side: "left", variant: "inset", collapsible: "offcanvas" }}
>
	{#snippet template(args)}
		<Sidebar.Provider style="min-height: 400px; width: 100%;">
			<Sidebar.Root {...args}>
				<Sidebar.Header>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton size="lg">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<HomeIcon class="size-4" />
								</div>
								<div class="flex flex-col gap-0.5 leading-none">
									<span class="font-semibold">Acme Inc</span>
								</div>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each navItems as item}
									{@const Icon = item.icon}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton isActive={item.active}>
											<Icon />
											<span>{item.label}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
			<Sidebar.Inset>
				<div class="flex items-center gap-2 p-4">
					<Sidebar.Trigger />
					<span class="text-muted-foreground text-sm"
						>Inset sidebar variant</span
					>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	{/snippet}
</Story>

<Story
	name="Non Collapsible"
	args={{ side: "left", variant: "sidebar", collapsible: "none" }}
>
	{#snippet template(args)}
		<Sidebar.Provider style="min-height: 400px; width: 100%;">
			<Sidebar.Root {...args}>
				<Sidebar.Header>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton size="lg">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<HomeIcon class="size-4" />
								</div>
								<div class="flex flex-col gap-0.5 leading-none">
									<span class="font-semibold">Acme Inc</span>
								</div>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each navItems as item}
									{@const Icon = item.icon}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton isActive={item.active}>
											<Icon />
											<span>{item.label}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
			<Sidebar.Inset>
				<div class="flex items-center gap-2 p-4">
					<span class="text-muted-foreground text-sm"
						>Always-visible sidebar (collapsible="none")</span
					>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	{/snippet}
</Story>

<Story
	name="Right Side"
	args={{ side: "right", variant: "sidebar", collapsible: "offcanvas" }}
>
	{#snippet template(args)}
		<Sidebar.Provider style="min-height: 400px; width: 100%;">
			<Sidebar.Inset>
				<div class="flex items-center gap-2 p-4">
					<Sidebar.Trigger />
					<span class="text-muted-foreground text-sm">Main content area</span>
				</div>
			</Sidebar.Inset>
			<Sidebar.Root {...args}>
				<Sidebar.Header>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								<HomeIcon />
								<span>Right Sidebar</span>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each navItems as item}
									{@const Icon = item.icon}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton>
											<Icon />
											<span>{item.label}</span>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
			</Sidebar.Root>
		</Sidebar.Provider>
	{/snippet}
</Story>
