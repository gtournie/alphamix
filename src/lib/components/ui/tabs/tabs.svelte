<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { onMount, tick } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.RootProps = $props();

	onMount(async () => {
		await tick();
		if (ref && !ref.querySelector('[data-slot="tabs-trigger"][data-state="active"]')) {
			const firstTrigger = ref.querySelector('[data-slot="tabs-trigger"]:not([disabled])') as HTMLElement | null;
			firstTrigger?.click();
		}
	});
</script>

<TabsPrimitive.Root
	bind:ref
	data-slot="tabs"
	class={cn("gap-2 group/tabs flex data-[orientation=horizontal]:flex-col", className)}
	{...restProps}
/>
