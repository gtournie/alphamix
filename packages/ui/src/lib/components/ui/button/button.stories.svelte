<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Spinner } from "$lib/components/ui/spinner/index.js";
	import { ButtonGroup } from "$lib/components/ui/button-group/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import CircleFadingArrowUpIcon from "@lucide/svelte/icons/circle-fading-arrow-up";
	import GitBranchIcon from "@lucide/svelte/icons/git-branch";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import MailCheckIcon from "@lucide/svelte/icons/mail-check";
	import ArchiveIcon from "@lucide/svelte/icons/archive";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import CalendarPlusIcon from "@lucide/svelte/icons/calendar-plus";
	import ListFilterIcon from "@lucide/svelte/icons/list-filter";
	import TagIcon from "@lucide/svelte/icons/tag";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";

	const { Story } = defineMeta({
		title: "UI/Button",
		component: Button,
		tags: ["autodocs"],
		argTypes: {
			variant: {
				control: "select",
				options: [
					"default",
					"outline",
					"secondary",
					"ghost",
					"destructive",
					"link",
				],
			},
			size: {
				control: "select",
				options: [
					"xs",
					"sm",
					"default",
					"lg",
					"icon",
					"icon-xs",
					"icon-sm",
					"icon-lg",
				],
			},
		},
	});
</script>

<script>
	let label = $state("personal");
</script>

<Story name="Size">
	{#snippet template()}
		<div class="flex flex-wrap items-center gap-2">
			<Button size="xs">
				<ArrowUpRightIcon data-icon="inline-start" />
				Extra Small
			</Button>
			<Button size="sm">
				<ArrowUpRightIcon data-icon="inline-start" />
				Small
			</Button>
			<Button>
				<ArrowUpRightIcon data-icon="inline-start" />
				Default
			</Button>
			<Button size="lg">
				<ArrowUpRightIcon data-icon="inline-start" />
				Large
			</Button>
		</div>
	{/snippet}
</Story>

<Story name="Default" args={{ variant: "default", size: "default" }}>
	{#snippet template(args)}
		<Button {...args}>Button</Button>
	{/snippet}
</Story>

<Story name="Outline">
	{#snippet template()}
		<Button variant="outline">Outline</Button>
	{/snippet}
</Story>

<Story name="Secondary">
	{#snippet template()}
		<Button variant="secondary">Secondary</Button>
	{/snippet}
</Story>

<Story name="Ghost">
	{#snippet template()}
		<Button variant="ghost">Ghost</Button>
	{/snippet}
</Story>

<Story name="Destructive">
	{#snippet template()}
		<Button variant="destructive">Destructive</Button>
	{/snippet}
</Story>

<Story name="Link">
	{#snippet template()}
		<Button variant="link">Link</Button>
	{/snippet}
</Story>

<Story name="Icon">
	{#snippet template()}
		<Button variant="outline" size="icon" aria-label="Update available">
			<CircleFadingArrowUpIcon />
		</Button>
	{/snippet}
</Story>

<Story name="With Icon">
	{#snippet template()}
		<Button>
			<GitBranchIcon data-icon="inline-start" />
			New Branch
		</Button>
	{/snippet}
</Story>

<Story name="Rounded">
	{#snippet template()}
		<Button class="rounded-full" size="icon" aria-label="Scroll to top">
			<ArrowUpIcon />
		</Button>
	{/snippet}
</Story>

<Story name="Spinner">
	{#snippet template()}
		<div class="flex flex-wrap items-center gap-2">
			<Button variant="outline" disabled aria-busy="true">
				<Spinner data-icon="inline-start" />
				Generating
			</Button>
			<Button variant="secondary" disabled aria-busy="true">
				Downloading
				<Spinner data-icon="inline-end" />
			</Button>
		</div>
	{/snippet}
</Story>

<Story name="Button Group">
	{#snippet template()}
		<ButtonGroup>
			<ButtonGroup class="sm:flex">
				<Button variant="outline" size="icon" aria-label="Go Back">
					<ArrowLeftIcon />
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline">Archive</Button>
				<Button variant="outline">Report</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline">Snooze</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								variant="outline"
								size="icon"
								aria-label="More Options"
								{...props}
							>
								<EllipsisIcon />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-40">
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<MailCheckIcon />
								Mark as Read
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<ArchiveIcon />
								Archive
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<ClockIcon />
								Snooze
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<CalendarPlusIcon />
								Add to Calendar
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<ListFilterIcon />
								Add to List
							</DropdownMenu.Item>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<TagIcon />
									Label As...
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.RadioGroup bind:value={label}>
										<DropdownMenu.RadioItem value="personal">
											Personal
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem value="work">
											Work
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem value="other">
											Other
										</DropdownMenu.RadioItem>
									</DropdownMenu.RadioGroup>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item variant="destructive">
								<Trash2Icon />
								Trash
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</ButtonGroup>
		</ButtonGroup>
	{/snippet}
</Story>

<Story name="As Child">
	{#snippet template()}
		<Button href="/login">Login</Button>
	{/snippet}
</Story>
