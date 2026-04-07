<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { toast } from "svelte-sonner";

	const { Story } = defineMeta({
		title: "UI/Sonner",
		component: Toaster,
		tags: ["autodocs"],
	});
</script>

<Story name="Types">
	{#snippet template()}
		<Toaster />
		<div class="flex flex-wrap gap-2">
			<Button variant="outline" onclick={() => toast("Event has been created")}
				>Default</Button
			>
			<Button
				variant="outline"
				onclick={() => toast.success("Event has been created")}>Success</Button
			>
			<Button
				variant="outline"
				onclick={() =>
					toast.info("Be at the area 10 minutes before the event time")}
				>Info</Button
			>
			<Button
				variant="outline"
				onclick={() =>
					toast.warning("Event start time cannot be earlier than 8am")}
				>Warning</Button
			>
			<Button
				variant="outline"
				onclick={() => toast.error("Event has not been created")}>Error</Button
			>
			<Button
				variant="outline"
				onclick={() => {
					toast.promise(
						new Promise((resolve) =>
							setTimeout(() => resolve({ name: "Event" }), 2000),
						),
						{
							loading: "Loading...",
							success: (data) => `${data.name} has been created`,
							error: "Error",
						},
					);
				}}>Promise</Button
			>
		</div>
	{/snippet}
</Story>

<Story name="Description">
	{#snippet template()}
		<Toaster />
		<Button
			variant="outline"
			class="w-fit"
			onclick={() =>
				toast("Event has been created", {
					description: "Monday, January 3rd at 6:00pm",
				})}
		>
			Show Toast
		</Button>
	{/snippet}
</Story>

<Story name="Position">
	{#snippet template()}
		<Toaster />
		<div class="flex flex-wrap justify-center gap-2 p-25">
			<Button
				variant="outline"
				onclick={() =>
					toast("Event has been created", { position: "top-left" })}
				>Top Left</Button
			>
			<Button
				variant="outline"
				onclick={() =>
					toast("Event has been created", { position: "top-center" })}
				>Top Center</Button
			>
			<Button
				variant="outline"
				onclick={() =>
					toast("Event has been created", { position: "top-right" })}
				>Top Right</Button
			>
			<Button
				variant="outline"
				onclick={() =>
					toast("Event has been created", { position: "bottom-left" })}
				>Bottom Left</Button
			>
			<Button
				variant="outline"
				onclick={() =>
					toast("Event has been created", { position: "bottom-center" })}
				>Bottom Center</Button
			>
			<Button
				variant="outline"
				onclick={() =>
					toast("Event has been created", { position: "bottom-right" })}
				>Bottom Right</Button
			>
		</div>
	{/snippet}
</Story>
