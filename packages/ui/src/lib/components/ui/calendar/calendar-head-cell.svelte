<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: CalendarPrimitive.HeadCellProps = $props();
</script>

<CalendarPrimitive.HeadCell
	bind:ref
	class={cn(
		"text-muted-foreground w-(--cell-size) rounded-md text-[0.8rem] font-normal",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</CalendarPrimitive.HeadCell>
