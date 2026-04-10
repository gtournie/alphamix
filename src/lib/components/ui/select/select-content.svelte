<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import SelectPortal from "./select-portal.svelte";
	import SelectScrollUpButton from "./select-scroll-up-button.svelte";
	import SelectScrollDownButton from "./select-scroll-down-button.svelte";
	import { cn, type WithoutChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		portalProps,
		children,
		preventScroll = true,
		position,
		...restProps
	}: WithoutChild<SelectPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPortal>>;
		position?: "popper" | "item-aligned";
	} = $props();

	const isItemAligned = $derived(position === "item-aligned");
	let contentEl = $state<HTMLElement | null>(null);

	$effect(() => {
		ref = contentEl;
	});

	// When item-aligned, shift the content up so the selected item overlaps the trigger.
	// The content must block pointer events until the opening click's pointerup is
	// processed — otherwise the translate moves a content item under the cursor and
	// the pointerup selects it, immediately closing the dropdown.
	// This mirrors Radix's triggerPointerDownPosRef mechanism.
	$effect(() => {
		if (!contentEl || !isItemAligned) {
			if (contentEl) contentEl.style.translate = "";
			return;
		}

		const el = contentEl;

		// Block pointer events so the opening pointerup can't select a content item
		el.style.pointerEvents = "none";

		const enablePointerEvents = () => {
			requestAnimationFrame(() => {
				el.style.pointerEvents = "";
			});
		};
		document.addEventListener("pointerup", enablePointerEvents, { once: true });

		// Position the content after Floating UI has finished
		requestAnimationFrame(() => {
			const selected = el.querySelector("[data-selected]") as HTMLElement | null;
			if (!selected) {
				el.style.translate = "";
				return;
			}

			const anchorHeight =
				parseFloat(
					getComputedStyle(el).getPropertyValue("--bits-select-anchor-height")
				) || 0;

			const contentRect = el.getBoundingClientRect();
			const itemRect = selected.getBoundingClientRect();
			const itemOffsetFromContentTop = itemRect.top - contentRect.top;

			el.style.translate = `0 ${-(anchorHeight + itemOffsetFromContentTop)}px`;
		});

		return () => {
			el.style.translate = "";
			el.style.pointerEvents = "";
			document.removeEventListener("pointerup", enablePointerEvents);
		};
	});
</script>

<SelectPortal {...portalProps}>
	<SelectPrimitive.Content
		bind:ref={contentEl}
		sideOffset={isItemAligned ? 0 : sideOffset}
		avoidCollisions={!isItemAligned}
		{preventScroll}
		data-slot="select-content"
		class={cn(
			"bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 max-h-96 rounded-lg shadow-md ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 relative isolate z-50 overflow-x-hidden overflow-y-auto",
			className
		)}
		{...restProps}
	>
		<SelectScrollUpButton />
		<SelectPrimitive.Viewport
			class={cn(
				"w-full min-w-(--bits-select-anchor-width) scroll-my-1",
				!isItemAligned && "h-(--bits-select-anchor-height)"
			)}
		>
			{@render children?.()}
		</SelectPrimitive.Viewport>
		<SelectScrollDownButton />
	</SelectPrimitive.Content>
</SelectPortal>
