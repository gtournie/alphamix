<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { toast } from "svelte-sonner";

	const positions = /** @type {const} */ ([
		"top-left",
		"top-center",
		"top-right",
		"bottom-left",
		"bottom-center",
		"bottom-right",
	]);

	const { Story } = defineMeta({
		title: "UI/Sonner",
		component: Toaster,
		tags: ["autodocs"],
	});
</script>

<script>
	let selectedPosition = $state(/** @type {typeof positions[number]} */ ("bottom-right"));
</script>

<Story name="Types">
	{#snippet template()}
		<Toaster />
		<div class="flex flex-wrap gap-2">
			<Button variant="outline" onclick={() => toast("Event has been created")}>Default</Button>
			<Button variant="outline" onclick={() => toast.success("Profile updated")}>Success</Button>
			<Button variant="outline" onclick={() => toast.info("Update available")}>Info</Button>
			<Button variant="outline" onclick={() => toast.warning("Caution required")}>Warning</Button>
			<Button variant="outline" onclick={() => toast.error("Something went wrong")}>Error</Button>
		</div>
	{/snippet}
</Story>

<Story name="Description">
	{#snippet template()}
		<Toaster />
		<Button
			variant="outline"
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
		<Toaster position={selectedPosition} />
		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap gap-2">
				{#each positions as pos}
					<Button
						variant={selectedPosition === pos ? "default" : "outline"}
						onclick={() => (selectedPosition = pos)}
					>
						{pos}
					</Button>
				{/each}
			</div>
			<Button
				variant="outline"
				class="w-fit"
				onclick={() => toast("Event has been created", { description: "Position: " + selectedPosition })}
			>
				Show Toast
			</Button>
		</div>
	{/snippet}
</Story>
