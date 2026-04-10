<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Empty from "$lib/components/ui/empty/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Kbd } from "$lib/components/ui/kbd/index.js";
	import BellIcon from "@lucide/svelte/icons/bell";
	import CloudIcon from "@lucide/svelte/icons/cloud";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import RefreshCcwIcon from "@lucide/svelte/icons/refresh-ccw";
	import SearchIcon from "@lucide/svelte/icons/search";

	const { Story } = defineMeta({
		title: "UI/Empty",
		component: Empty.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Outline">
	{#snippet template()}
		<Empty.Root class="h-full bg-muted/30">
			<Empty.Header>
				<Empty.Media variant="icon">
					<CloudIcon />
				</Empty.Media>
				<Empty.Title>Cloud Storage Empty</Empty.Title>
				<Empty.Description>
					Upload files to your cloud storage to access them anywhere.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" size="sm">Upload Files</Button>
			</Empty.Content>
		</Empty.Root>
	{/snippet}
</Story>

<Story name="Background">
	{#snippet template()}
		<Empty.Root class="h-full bg-muted/30">
			<Empty.Header>
				<Empty.Media variant="icon">
					<BellIcon />
				</Empty.Media>
				<Empty.Title>No Notifications</Empty.Title>
				<Empty.Description class="max-w-xs text-pretty">
					You're all caught up. New notifications will appear here.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline">
					<RefreshCcwIcon />
					Refresh
				</Button>
			</Empty.Content>
		</Empty.Root>
	{/snippet}
</Story>

<Story name="Avatar">
	{#snippet template()}
		<Empty.Root class="h-full bg-muted/30">
			<Empty.Header>
				<Empty.Media variant="default">
					<Avatar.Root class="size-12">
						<Avatar.Image
							src="https://github.com/shadcn.png"
							class="grayscale"
						/>
						<Avatar.Fallback>LR</Avatar.Fallback>
					</Avatar.Root>
				</Empty.Media>
				<Empty.Title>User Offline</Empty.Title>
				<Empty.Description>
					This user is currently offline. You can leave a message to notify them
					or try again later.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button size="sm">Leave Message</Button>
			</Empty.Content>
		</Empty.Root>
	{/snippet}
</Story>

<Story name="Avatar Group">
	{#snippet template()}
		<Empty.Root class="h-full bg-muted/30">
			<Empty.Header>
				<Empty.Media>
					<div
						class="flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale"
					>
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
						<Avatar.Root>
							<Avatar.Image
								src="https://github.com/maxleiter.png"
								alt="@maxleiter"
							/>
							<Avatar.Fallback>LR</Avatar.Fallback>
						</Avatar.Root>
						<Avatar.Root>
							<Avatar.Image
								src="https://github.com/evilrabbit.png"
								alt="@evilrabbit"
							/>
							<Avatar.Fallback>ER</Avatar.Fallback>
						</Avatar.Root>
					</div>
				</Empty.Media>
				<Empty.Title>No Team Members</Empty.Title>
				<Empty.Description
					>Invite your team to collaborate on this project.</Empty.Description
				>
			</Empty.Header>
			<Empty.Content>
				<Button size="sm">
					<PlusIcon />
					Invite Members
				</Button>
			</Empty.Content>
		</Empty.Root>
	{/snippet}
</Story>

<Story name="InputGroup">
	{#snippet template()}
		<Empty.Root class="h-full bg-muted/30">
			<Empty.Header>
				<Empty.Title>404 - Not Found</Empty.Title>
				<Empty.Description>
					The page you're looking for doesn't exist. Try searching for what you
					need below.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<InputGroup.Root class="sm:w-3/4">
					<InputGroup.Input placeholder="Try searching for pages..." />
					<InputGroup.Addon>
						<SearchIcon />
					</InputGroup.Addon>
					<InputGroup.Addon align="inline-end">
						<Kbd>/</Kbd>
					</InputGroup.Addon>
				</InputGroup.Root>
				<Empty.Description>
					Need help? <a href="#fake">Contact support</a>
				</Empty.Description>
			</Empty.Content>
		</Empty.Root>
	{/snippet}
</Story>
