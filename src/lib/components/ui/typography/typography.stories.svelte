<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";

	const { Story } = defineMeta({
		title: "UI/Typography",
		tags: ["autodocs"],
		parameters: {
			docs: {
				description: {
					component:
						"Typography styles applied directly to HTML elements via Tailwind CSS utility classes. No Svelte component — copy the classes directly.",
				},
			},
		},
	});
</script>

<Story name="H1">
	{#snippet template()}
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Taxing Laughter: The Joke Tax Chronicles
		</h1>
	{/snippet}
</Story>

<Story name="H2">
	{#snippet template()}
		<h2
			class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
		>
			The People of the Kingdom
		</h2>
	{/snippet}
</Story>

<Story name="H3">
	{#snippet template()}
		<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
			The Joke Tax
		</h3>
	{/snippet}
</Story>

<Story name="H4">
	{#snippet template()}
		<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
			People stopped telling jokes
		</h4>
	{/snippet}
</Story>

<Story name="P">
	{#snippet template()}
		<p class="leading-7 not-first:mt-6">
			The king, seeing how much happier his subjects were, realized the error of
			his ways and repealed the joke tax.
		</p>
	{/snippet}
</Story>

<Story name="Blockquote">
	{#snippet template()}
		<blockquote class="mt-6 border-l-2 pl-6 italic">
			"After all," he said, "everyone enjoys a good joke, so it's only fair that
			they should pay for the privilege."
		</blockquote>
	{/snippet}
</Story>

<Story name="List">
	{#snippet template()}
		<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
			<li>1st level of puns: 5 gold coins</li>
			<li>2nd level of jokes: 10 gold coins</li>
			<li>3rd level of one-liners : 20 gold coins</li>
		</ul>
	{/snippet}
</Story>

<Story name="Inline Code">
	{#snippet template()}
		<p class="leading-7">
			<code
				class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
				>@radix-ui/react-alert-dialog</code
			>
		</p>
	{/snippet}
</Story>

<Story name="Lead">
	{#snippet template()}
		<p class="text-muted-foreground text-xl">
			A modal dialog that interrupts the user with important content and expects
			a response.
		</p>
	{/snippet}
</Story>

<Story name="Large">
	{#snippet template()}
		<!-- intentionally a div, matching the shadcn typography recipe -->
		<div class="text-lg font-semibold">Are you absolutely sure?</div>
	{/snippet}
</Story>

<Story name="Small">
	{#snippet template()}
		<small class="text-sm leading-none font-medium">Email address</small>
	{/snippet}
</Story>

<Story name="Muted">
	{#snippet template()}
		<p class="text-muted-foreground text-sm">Enter your email address.</p>
	{/snippet}
</Story>
