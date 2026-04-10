<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import BellIcon from "@lucide/svelte/icons/bell";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import EyeIcon from "@lucide/svelte/icons/eye";
	import FileCodeIcon from "@lucide/svelte/icons/file-code";
	import FileIcon from "@lucide/svelte/icons/file";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import FolderIcon from "@lucide/svelte/icons/folder";
	import FolderOpenIcon from "@lucide/svelte/icons/folder-open";
	import FolderSearchIcon from "@lucide/svelte/icons/folder-search";
	import HelpCircleIcon from "@lucide/svelte/icons/help-circle";
	import KeyboardIcon from "@lucide/svelte/icons/keyboard";
	import LanguagesIcon from "@lucide/svelte/icons/languages";
	import LayoutIcon from "@lucide/svelte/icons/layout";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import MailIcon from "@lucide/svelte/icons/mail";
	import MessageSquareIcon from "@lucide/svelte/icons/message-square";
	import MonitorIcon from "@lucide/svelte/icons/monitor";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";
	import PaletteIcon from "@lucide/svelte/icons/palette";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import SaveIcon from "@lucide/svelte/icons/save";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import ShareIcon from "@lucide/svelte/icons/share";
	import ShieldIcon from "@lucide/svelte/icons/shield";
	import SunIcon from "@lucide/svelte/icons/sun";
	import TrashIcon from "@lucide/svelte/icons/trash";
	import UserIcon from "@lucide/svelte/icons/user";
	import WalletIcon from "@lucide/svelte/icons/wallet";

	const { Story } = defineMeta({
		title: "UI/DropdownMenu",
		component: DropdownMenu.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let checkboxesStatusBar = $state(true);
	let checkboxesActivityBar = $state(false);
	let checkboxesPanel = $state(false);

	let checkboxesIconsEmail = $state(true);
	let checkboxesIconsSms = $state(false);
	let checkboxesIconsPush = $state(true);

	let radioPosition = $state("bottom");
	let radioPaymentMethod = $state("card");

	let complexShowSidebar = $state(true);
	let complexShowStatusBar = $state(false);
	let complexNotificationsEmail = $state(true);
	let complexNotificationsPush = $state(true);
	let complexTheme = $state("light");
</script>

<Story name="Basic">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Item>Profile</DropdownMenu.Item>
					<DropdownMenu.Item>Billing</DropdownMenu.Item>
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>GitHub</DropdownMenu.Item>
				<DropdownMenu.Item>Support</DropdownMenu.Item>
				<DropdownMenu.Item disabled>API</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Submenu">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Item>Team</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>Invite users</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent>
								<DropdownMenu.Item>Email</DropdownMenu.Item>
								<DropdownMenu.Item>Message</DropdownMenu.Item>
								<DropdownMenu.Sub>
									<DropdownMenu.SubTrigger>More options</DropdownMenu.SubTrigger>
									<DropdownMenu.Portal>
										<DropdownMenu.SubContent>
											<DropdownMenu.Item>Calendly</DropdownMenu.Item>
											<DropdownMenu.Item>Slack</DropdownMenu.Item>
											<DropdownMenu.Separator />
											<DropdownMenu.Item>Webhook</DropdownMenu.Item>
										</DropdownMenu.SubContent>
									</DropdownMenu.Portal>
								</DropdownMenu.Sub>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>Advanced...</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
					<DropdownMenu.Item>
						New Team
						<DropdownMenu.Shortcut>⌘+T</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Shortcuts">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Item>
						Profile
						<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						Billing
						<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						Settings
						<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					Log out
					<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Icons">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item>
					<UserIcon />
					Profile
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<CreditCardIcon />
					Billing
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<SettingsIcon />
					Settings
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive">
					<LogOutIcon />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Checkboxes">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-40">
				<DropdownMenu.Group>
					<DropdownMenu.Label>Appearance</DropdownMenu.Label>
					<DropdownMenu.CheckboxItem bind:checked={checkboxesStatusBar}>
						Status Bar
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem bind:checked={checkboxesActivityBar} disabled>
						Activity Bar
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem bind:checked={checkboxesPanel}>
						Panel
					</DropdownMenu.CheckboxItem>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Checkboxes Icons">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Notifications</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-48">
				<DropdownMenu.Group>
					<DropdownMenu.Label>Notification Preferences</DropdownMenu.Label>
					<DropdownMenu.CheckboxItem bind:checked={checkboxesIconsEmail}>
						<MailIcon />
						Email notifications
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem bind:checked={checkboxesIconsSms}>
						<MessageSquareIcon />
						SMS notifications
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem bind:checked={checkboxesIconsPush}>
						<BellIcon />
						Push notifications
					</DropdownMenu.CheckboxItem>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Radio Group">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-32">
				<DropdownMenu.Group>
					<DropdownMenu.Label>Panel Position</DropdownMenu.Label>
					<DropdownMenu.RadioGroup bind:value={radioPosition}>
						<DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Radio Icons">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Payment Method</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="min-w-56">
				<DropdownMenu.Group>
					<DropdownMenu.Label>Select Payment Method</DropdownMenu.Label>
					<DropdownMenu.RadioGroup bind:value={radioPaymentMethod}>
						<DropdownMenu.RadioItem value="card">
							<CreditCardIcon />
							Credit Card
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="paypal">
							<WalletIcon />
							PayPal
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="bank">
							<Building2Icon />
							Bank Transfer
						</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Destructive">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Actions</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<PencilIcon />
						Edit
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<ShareIcon />
						Share
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item variant="destructive">
						<TrashIcon />
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Avatar">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" class="rounded-full" {...props}>
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" />
							<Avatar.Fallback>LR</Avatar.Fallback>
						</Avatar.Root>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<BadgeCheckIcon />
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						Billing
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<BellIcon />
						Notifications
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogOutIcon />
					Sign Out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>

<Story name="Complex">
	{#snippet template()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Complex Menu</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-44">
				<DropdownMenu.Group>
					<DropdownMenu.Label>File</DropdownMenu.Label>
					<DropdownMenu.Item>
						<FileIcon />
						New File
						<DropdownMenu.Shortcut>⌘N</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FolderIcon />
						New Folder
						<DropdownMenu.Shortcut>⇧⌘N</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							<FolderOpenIcon />
							Open Recent
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent>
								<DropdownMenu.Group>
									<DropdownMenu.Label>Recent Projects</DropdownMenu.Label>
									<DropdownMenu.Item>
										<FileCodeIcon />
										Project Alpha
									</DropdownMenu.Item>
									<DropdownMenu.Item>
										<FileCodeIcon />
										Project Beta
									</DropdownMenu.Item>
									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger>
											<MoreHorizontalIcon />
											More Projects
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Portal>
											<DropdownMenu.SubContent>
												<DropdownMenu.Item>
													<FileCodeIcon />
													Project Gamma
												</DropdownMenu.Item>
												<DropdownMenu.Item>
													<FileCodeIcon />
													Project Delta
												</DropdownMenu.Item>
											</DropdownMenu.SubContent>
										</DropdownMenu.Portal>
									</DropdownMenu.Sub>
								</DropdownMenu.Group>
								<DropdownMenu.Separator />
								<DropdownMenu.Group>
									<DropdownMenu.Item>
										<FolderSearchIcon />
										Browse...
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<SaveIcon />
						Save
						<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<DownloadIcon />
						Export
						<DropdownMenu.Shortcut>⇧⌘E</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Label>View</DropdownMenu.Label>
					<DropdownMenu.CheckboxItem bind:checked={complexShowSidebar}>
						<EyeIcon />
						Show Sidebar
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem bind:checked={complexShowStatusBar}>
						<LayoutIcon />
						Show Status Bar
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							<PaletteIcon />
							Theme
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent>
								<DropdownMenu.Group>
									<DropdownMenu.Label>Appearance</DropdownMenu.Label>
									<DropdownMenu.RadioGroup bind:value={complexTheme}>
										<DropdownMenu.RadioItem value="light">
											<SunIcon />
											Light
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem value="dark">
											<MoonIcon />
											Dark
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem value="system">
											<MonitorIcon />
											System
										</DropdownMenu.RadioItem>
									</DropdownMenu.RadioGroup>
								</DropdownMenu.Group>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Label>Account</DropdownMenu.Label>
					<DropdownMenu.Item>
						<UserIcon />
						Profile
						<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						Billing
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							<SettingsIcon />
							Settings
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent>
								<DropdownMenu.Group>
									<DropdownMenu.Label>Preferences</DropdownMenu.Label>
									<DropdownMenu.Item>
										<KeyboardIcon />
										Keyboard Shortcuts
									</DropdownMenu.Item>
									<DropdownMenu.Item>
										<LanguagesIcon />
										Language
									</DropdownMenu.Item>
									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger>
											<BellIcon />
											Notifications
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Portal>
											<DropdownMenu.SubContent>
												<DropdownMenu.Group>
													<DropdownMenu.Label>Notification Types</DropdownMenu.Label>
													<DropdownMenu.CheckboxItem bind:checked={complexNotificationsPush}>
														<BellIcon />
														Push Notifications
													</DropdownMenu.CheckboxItem>
													<DropdownMenu.CheckboxItem bind:checked={complexNotificationsEmail}>
														<MailIcon />
														Email Notifications
													</DropdownMenu.CheckboxItem>
												</DropdownMenu.Group>
											</DropdownMenu.SubContent>
										</DropdownMenu.Portal>
									</DropdownMenu.Sub>
								</DropdownMenu.Group>
								<DropdownMenu.Separator />
								<DropdownMenu.Group>
									<DropdownMenu.Item>
										<ShieldIcon />
										Privacy & Security
									</DropdownMenu.Item>
								</DropdownMenu.Group>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<HelpCircleIcon />
						Help & Support
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FileTextIcon />
						Documentation
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item variant="destructive">
						<LogOutIcon />
						Sign Out
						<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Story>
