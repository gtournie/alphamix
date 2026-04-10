<script lang="ts">
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import { type DateValue, DateFormatter, getLocalTimeZone } from "@internationalized/date";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";

	let {
		ref = $bindable(null),
		value = $bindable<DateValue | undefined>(),
		open = $bindable(false),
		placeholder = "Select a date",
		locale = "en-US",
		captionLayout = "label" as "label" | "dropdown" | "dropdown-months" | "dropdown-years",
		buttonClass,
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: DateValue | undefined;
		open?: boolean;
		placeholder?: string;
		locale?: string;
		captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
		buttonClass?: string;
	} = $props();

	const df = $derived(new DateFormatter(locale, { dateStyle: "long" }));
</script>

<div data-slot="date-picker" bind:this={ref} class={cn(className)} {...restProps}>
	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class={cn(
						"justify-start text-start font-normal",
						!value && "text-muted-foreground",
						buttonClass
					)}
				>
					<CalendarIcon class="me-2 size-4" />
					{value ? df.format(value.toDate(getLocalTimeZone())) : placeholder}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar
				bind:value
				type="single"
				{captionLayout}
				onValueChange={() => {
					open = false;
				}}
			/>
		</Popover.Content>
	</Popover.Root>
</div>
