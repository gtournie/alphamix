<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Command from "$lib/components/ui/command/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import SmileIcon from "@lucide/svelte/icons/smile";
	import CalculatorIcon from "@lucide/svelte/icons/calculator";
	import UserIcon from "@lucide/svelte/icons/user";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import HomeIcon from "@lucide/svelte/icons/home";
	import InboxIcon from "@lucide/svelte/icons/inbox";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import FolderIcon from "@lucide/svelte/icons/folder";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import FolderPlusIcon from "@lucide/svelte/icons/folder-plus";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import ScissorsIcon from "@lucide/svelte/icons/scissors";
	import TrashIcon from "@lucide/svelte/icons/trash";
	import LayoutGridIcon from "@lucide/svelte/icons/layout-grid";
	import ListIcon from "@lucide/svelte/icons/list";
	import ZoomInIcon from "@lucide/svelte/icons/zoom-in";
	import ZoomOutIcon from "@lucide/svelte/icons/zoom-out";
	import BellIcon from "@lucide/svelte/icons/bell";
	import HelpCircleIcon from "@lucide/svelte/icons/help-circle";
	import ImageIcon from "@lucide/svelte/icons/image";
	import CodeIcon from "@lucide/svelte/icons/code";

	const { Story } = defineMeta({
		title: "UI/Command",
		component: Command.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let basicOpen = $state(false);
	let shortcutsOpen = $state(false);
	let groupsOpen = $state(false);
	let scrollableOpen = $state(false);
</script>

<Story name="Basic">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<Button
				onclick={() => (basicOpen = true)}
				variant="outline"
				class="w-fit"
			>
				Open Menu
			</Button>
			<Command.Dialog bind:open={basicOpen}>
				<Command.Input placeholder="Type a command or search..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Suggestions">
						<Command.Item value="calendar">
							<span>Calendar</span>
						</Command.Item>
						<Command.Item value="search-emoji">
							<span>Search Emoji</span>
						</Command.Item>
						<Command.Item value="calculator" disabled>
							<span>Calculator</span>
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Dialog>
		</div>
	{/snippet}
</Story>

<Story name="Shortcuts">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<Button
				onclick={() => (shortcutsOpen = true)}
				variant="outline"
				class="w-fit"
			>
				Open Menu
			</Button>
			<Command.Dialog bind:open={shortcutsOpen}>
				<Command.Input placeholder="Type a command or search..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Settings">
						<Command.Item value="profile">
							<UserIcon />
							<span>Profile</span>
							<Command.Shortcut>⌘P</Command.Shortcut>
						</Command.Item>
						<Command.Item value="billing">
							<CreditCardIcon />
							<span>Billing</span>
							<Command.Shortcut>⌘B</Command.Shortcut>
						</Command.Item>
						<Command.Item value="settings">
							<SettingsIcon />
							<span>Settings</span>
							<Command.Shortcut>⌘S</Command.Shortcut>
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Dialog>
		</div>
	{/snippet}
</Story>

<Story name="Groups">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<Button
				onclick={() => (groupsOpen = true)}
				variant="outline"
				class="w-fit"
			>
				Open Menu
			</Button>
			<Command.Dialog bind:open={groupsOpen}>
				<Command.Input placeholder="Type a command or search..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Suggestions">
						<Command.Item value="calendar">
							<CalendarIcon />
							<span>Calendar</span>
						</Command.Item>
						<Command.Item value="search-emoji">
							<SmileIcon />
							<span>Search Emoji</span>
						</Command.Item>
						<Command.Item value="calculator">
							<CalculatorIcon />
							<span>Calculator</span>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Settings">
						<Command.Item value="profile">
							<UserIcon />
							<span>Profile</span>
							<Command.Shortcut>⌘P</Command.Shortcut>
						</Command.Item>
						<Command.Item value="billing">
							<CreditCardIcon />
							<span>Billing</span>
							<Command.Shortcut>⌘B</Command.Shortcut>
						</Command.Item>
						<Command.Item value="settings">
							<SettingsIcon />
							<span>Settings</span>
							<Command.Shortcut>⌘S</Command.Shortcut>
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Dialog>
		</div>
	{/snippet}
</Story>

<Story name="Scrollable">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<Button
				onclick={() => (scrollableOpen = true)}
				variant="outline"
				class="w-fit"
			>
				Open Menu
			</Button>
			<Command.Dialog bind:open={scrollableOpen}>
				<Command.Input placeholder="Type a command or search..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Navigation">
						<Command.Item value="home">
							<HomeIcon />
							<span>Home</span>
							<Command.Shortcut>⌘H</Command.Shortcut>
						</Command.Item>
						<Command.Item value="inbox">
							<InboxIcon />
							<span>Inbox</span>
							<Command.Shortcut>⌘I</Command.Shortcut>
						</Command.Item>
						<Command.Item value="documents">
							<FileTextIcon />
							<span>Documents</span>
							<Command.Shortcut>⌘D</Command.Shortcut>
						</Command.Item>
						<Command.Item value="folders">
							<FolderIcon />
							<span>Folders</span>
							<Command.Shortcut>⌘F</Command.Shortcut>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Actions">
						<Command.Item value="new-file">
							<PlusIcon />
							<span>New File</span>
							<Command.Shortcut>⌘N</Command.Shortcut>
						</Command.Item>
						<Command.Item value="new-folder">
							<FolderPlusIcon />
							<span>New Folder</span>
							<Command.Shortcut>⇧⌘N</Command.Shortcut>
						</Command.Item>
						<Command.Item value="copy">
							<CopyIcon />
							<span>Copy</span>
							<Command.Shortcut>⌘C</Command.Shortcut>
						</Command.Item>
						<Command.Item value="cut">
							<ScissorsIcon />
							<span>Cut</span>
							<Command.Shortcut>⌘X</Command.Shortcut>
						</Command.Item>
						<Command.Item value="delete">
							<TrashIcon />
							<span>Delete</span>
							<Command.Shortcut>⌫</Command.Shortcut>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="View">
						<Command.Item value="grid-view">
							<LayoutGridIcon />
							<span>Grid View</span>
						</Command.Item>
						<Command.Item value="list-view">
							<ListIcon />
							<span>List View</span>
						</Command.Item>
						<Command.Item value="zoom-in">
							<ZoomInIcon />
							<span>Zoom In</span>
							<Command.Shortcut>⌘+</Command.Shortcut>
						</Command.Item>
						<Command.Item value="zoom-out">
							<ZoomOutIcon />
							<span>Zoom Out</span>
							<Command.Shortcut>⌘-</Command.Shortcut>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Account">
						<Command.Item value="profile">
							<UserIcon />
							<span>Profile</span>
							<Command.Shortcut>⌘P</Command.Shortcut>
						</Command.Item>
						<Command.Item value="billing">
							<CreditCardIcon />
							<span>Billing</span>
							<Command.Shortcut>⌘B</Command.Shortcut>
						</Command.Item>
						<Command.Item value="settings">
							<SettingsIcon />
							<span>Settings</span>
							<Command.Shortcut>⌘S</Command.Shortcut>
						</Command.Item>
						<Command.Item value="notifications">
							<BellIcon />
							<span>Notifications</span>
						</Command.Item>
						<Command.Item value="help">
							<HelpCircleIcon />
							<span>Help & Support</span>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Tools">
						<Command.Item value="calc-tool">
							<CalculatorIcon />
							<span>Calculator</span>
						</Command.Item>
						<Command.Item value="calendar-tool">
							<CalendarIcon />
							<span>Calendar</span>
						</Command.Item>
						<Command.Item value="image-editor">
							<ImageIcon />
							<span>Image Editor</span>
						</Command.Item>
						<Command.Item value="code-editor">
							<CodeIcon />
							<span>Code Editor</span>
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Dialog>
		</div>
	{/snippet}
</Story>
