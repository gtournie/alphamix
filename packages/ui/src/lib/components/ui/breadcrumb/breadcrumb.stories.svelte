<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Root as BreadcrumbRoot } from "$lib/components/ui/breadcrumb/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import DotIcon from "@lucide/svelte/icons/dot";
	import SlashIcon from "@lucide/svelte/icons/slash";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

	const { Story } = defineMeta({
		title: "UI/Breadcrumb",
		component: BreadcrumbRoot,
		tags: ["autodocs"],
		argTypes: {
			class: { control: "text", description: "Additional CSS classes" },
		},
	});
</script>

<Story name="Basic" args={{}}>
	{#snippet template(args)}
		<Breadcrumb.Root {...args}>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/snippet}
</Story>

<Story name="Custom separator" args={{}}>
	{#snippet template(args)}
		<Breadcrumb.Root {...args}>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator>
					<DotIcon />
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator>
					<DotIcon />
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/snippet}
</Story>

<Story name="Dropdown" args={{}}>
	{#snippet template(args)}
		<Breadcrumb.Root {...args}>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator>
					<DotIcon />
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex items-center gap-1">
							Components
							<ChevronDownIcon class="size-4" />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start">
							<DropdownMenu.Item>Documentation</DropdownMenu.Item>
							<DropdownMenu.Item>Themes</DropdownMenu.Item>
							<DropdownMenu.Item>GitHub</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Breadcrumb.Item>
				<Breadcrumb.Separator>
					<DotIcon />
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/snippet}
</Story>

<Story name="Collapsed" args={{}}>
	{#snippet template(args)}
		<Breadcrumb.Root {...args}>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Ellipsis />
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/docs/components">Components</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/snippet}
</Story>

<Story name="Link component" args={{}}>
	{#snippet template(args)}
		<Breadcrumb.Root {...args}>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link>
						{#snippet child({ props })}
							<a href="/" {...props}>Home</a>
						{/snippet}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link>
						{#snippet child({ props })}
							<a href="/components" {...props}>Components</a>
						{/snippet}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/snippet}
</Story>
