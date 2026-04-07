<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Spinner } from "$lib/components/ui/spinner/index.js";
	import { Kbd } from "$lib/components/ui/kbd/index.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import Code2Icon from "@lucide/svelte/icons/code-2";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import CornerDownLeftIcon from "@lucide/svelte/icons/corner-down-left";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import InfoIcon from "@lucide/svelte/icons/info";
	import LoaderIcon from "@lucide/svelte/icons/loader";
	import MailIcon from "@lucide/svelte/icons/mail";
	import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";
	import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
	import SearchIcon from "@lucide/svelte/icons/search";
	import StarIcon from "@lucide/svelte/icons/star";

	const { Story } = defineMeta({
		title: "UI/InputGroup",
		component: InputGroup.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let isCopied = $state(false);
	let isFavorite = $state(false);

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}
</script>

<Story name="Icon">
	{#snippet template()}
		<div class="grid w-full max-w-sm gap-6">
			<InputGroup.Root>
				<InputGroup.Input placeholder="Search..." />
				<InputGroup.Addon>
					<SearchIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input type="email" placeholder="Enter your email" />
				<InputGroup.Addon>
					<MailIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Card number" />
				<InputGroup.Addon>
					<CreditCardIcon />
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<CheckIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Card number" />
				<InputGroup.Addon align="inline-end">
					<StarIcon />
					<InfoIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Text">
	{#snippet template()}
		<div class="grid w-full max-w-sm gap-6">
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>$</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input placeholder="0.00" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>USD</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input placeholder="example.com" class="pl-0.5!" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>.com</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Enter your username" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>@company.com</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Textarea placeholder="Enter your message" />
				<InputGroup.Addon align="block-end">
					<InputGroup.Text class="text-muted-foreground text-xs">
						120 characters left
					</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Button">
	{#snippet template()}
		<div class="grid w-full max-w-sm gap-6">
			<InputGroup.Root>
				<InputGroup.Input placeholder="https://x.com/shadcn" readonly />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onclick={() => copyToClipboard("https://x.com/shadcn")}
					>
						{#if isCopied}
							<CheckIcon />
						{:else}
							<CopyIcon />
						{/if}
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root class="[--radius:9999px]">
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}
							<InputGroup.Addon {...props}>
								<InputGroup.Button variant="secondary" size="icon-xs">
									<InfoIcon />
								</InputGroup.Button>
							</InputGroup.Addon>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content align="start" class="flex flex-col gap-1 rounded-xl text-sm">
						<p class="font-medium">Your connection is not secure.</p>
						<p>You should not enter any sensitive information on this site.</p>
					</Popover.Content>
				</Popover.Root>
				<InputGroup.Addon class="text-muted-foreground pl-1.5">https://</InputGroup.Addon>
				<InputGroup.Input id="input-secure-19" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button onclick={() => (isFavorite = !isFavorite)} size="icon-xs">
						<StarIcon
							data-favorite={isFavorite}
							class="data-[favorite=true]:fill-blue-600 data-[favorite=true]:stroke-blue-600"
						/>
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Type to search..." />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button variant="secondary">Search</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Kbd">
	{#snippet template()}
		<InputGroup.Root class="max-w-sm">
			<InputGroup.Input placeholder="Search..." />
			<InputGroup.Addon>
				<SearchIcon class="text-muted-foreground" />
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<Kbd>⌘K</Kbd>
			</InputGroup.Addon>
		</InputGroup.Root>
	{/snippet}
</Story>

<Story name="Dropdown">
	{#snippet template()}
		<div class="grid w-full max-w-sm gap-4">
			<InputGroup.Root>
				<InputGroup.Input placeholder="Enter file name" />
				<InputGroup.Addon align="inline-end">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<InputGroup.Button variant="ghost" aria-label="More" size="icon-xs" {...props}>
									<MoreHorizontalIcon />
								</InputGroup.Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Group>
								<DropdownMenu.Item>Settings</DropdownMenu.Item>
								<DropdownMenu.Item>Copy path</DropdownMenu.Item>
								<DropdownMenu.Item>Open location</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root class="[--radius:1rem]">
				<InputGroup.Input placeholder="Enter search query" />
				<InputGroup.Addon align="inline-end">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<InputGroup.Button variant="ghost" class="pr-1.5! text-xs" {...props}>
									Search In... <ChevronDownIcon class="size-3" />
								</InputGroup.Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="[--radius:0.95rem]">
							<DropdownMenu.Group>
								<DropdownMenu.Item>Documentation</DropdownMenu.Item>
								<DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
								<DropdownMenu.Item>Changelog</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Spinner">
	{#snippet template()}
		<div class="grid w-full max-w-sm gap-4">
			<InputGroup.Root>
				<InputGroup.Input placeholder="Searching..." />
				<InputGroup.Addon align="inline-end">
					<Spinner />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Processing..." />
				<InputGroup.Addon>
					<Spinner />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Saving changes..." />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>Saving...</InputGroup.Text>
					<Spinner />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Refreshing data..." />
				<InputGroup.Addon>
					<LoaderIcon class="animate-spin" />
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text class="text-muted-foreground">Please wait...</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Textarea">
	{#snippet template()}
		<div class="grid w-full max-w-md gap-4">
			<InputGroup.Root>
				<InputGroup.Textarea
					id="textarea-code-32"
					placeholder="console.log('Hello, world!');"
					class="min-h-[200px]"
				/>
				<InputGroup.Addon align="block-end" class="border-t">
					<InputGroup.Text>Line 1, Column 1</InputGroup.Text>
					<InputGroup.Button size="sm" class="ml-auto" variant="default">
						Run <CornerDownLeftIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
				<InputGroup.Addon align="block-start" class="border-b">
					<InputGroup.Text class="font-mono font-medium">
						<Code2Icon />
						script.js
					</InputGroup.Text>
					<InputGroup.Button class="ml-auto" size="icon-xs">
						<RefreshCwIcon />
					</InputGroup.Button>
					<InputGroup.Button variant="ghost" size="icon-xs">
						<CopyIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>

<Story name="Custom Input">
	{#snippet template()}
		<div class="grid w-full max-w-sm gap-6">
			<InputGroup.Root>
				<textarea
					data-slot="input-group-control"
					aria-label="Message"
					class="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
					placeholder="Autoresize textarea..."
				></textarea>
				<InputGroup.Addon align="block-end">
					<InputGroup.Button class="ml-auto" size="sm" variant="default">Submit</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	{/snippet}
</Story>
