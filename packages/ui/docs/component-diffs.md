# Component Diffs — Local vs shadcn-svelte Registry

Generated: Tue Apr  7 10:47:23 CEST 2026

## accordion

```diff
--- /tmp/shadcn-diffs/accordion-registry.svelte	2026-04-07 10:47:23
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/accordion/accordion.svelte	2026-04-06 22:52:05
@@ -1,22 +1,19 @@
 <script lang="ts">
 	import { Accordion as AccordionPrimitive } from "bits-ui";
-	import { cn, type WithoutChild } from "$UTILS$.js";
+	import { cn } from "$lib/utils.js";
 
 	let {
 		ref = $bindable(null),
+		value = $bindable(),
 		class: className,
-		children,
 		...restProps
-	}: WithoutChild<AccordionPrimitive.ContentProps> = $props();
+	}: AccordionPrimitive.RootProps = $props();
 </script>
 
-<AccordionPrimitive.Content
+<AccordionPrimitive.Root
 	bind:ref
-	data-slot="accordion-content"
-	class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
+	bind:value={value as never}
+	data-slot="accordion"
+	class={cn("overflow-hidden rounded-md border flex flex-col", className)}
 	{...restProps}
->
-	<div class={cn("pt-0 pb-4", className)}>
-		{@render children?.()}
-	</div>
-</AccordionPrimitive.Content>
+/>
```

## alert

```diff
--- /tmp/shadcn-diffs/alert-registry.svelte	2026-04-07 10:47:23
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/alert/alert-description.svelte	2026-04-06 22:52:05
@@ -1,6 +1,6 @@
 <script lang="ts">
 	import type { HTMLAttributes } from "svelte/elements";
-	import { cn, type WithElementRef } from "$UTILS$.js";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 
 	let {
 		ref = $bindable(null),
@@ -14,7 +14,7 @@
 	bind:this={ref}
 	data-slot="alert-description"
 	class={cn(
-		"text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
+		"text-muted-foreground text-xs/relaxed text-balance md:text-pretty group-has-[>svg]/alert:col-start-2 [&_p:not(:last-child)]:mb-4 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
 		className
 	)}
 	{...restProps}
```

## alert-dialog

```diff
--- /tmp/shadcn-diffs/alert-dialog-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/alert-dialog/alert-dialog-cancel.svelte	2026-04-06 22:52:05
@@ -1,18 +1,27 @@
 <script lang="ts">
 	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
-	import { buttonVariants } from "$UI$/button/index.js";
-	import { cn } from "$UTILS$.js";
+	import {
+		buttonVariants,
+		type ButtonVariant,
+		type ButtonSize,
+	} from "$lib/components/ui/button/index.js";
+	import { cn } from "$lib/utils.js";
 
 	let {
 		ref = $bindable(null),
 		class: className,
+		variant = "outline",
+		size = "default",
 		...restProps
-	}: AlertDialogPrimitive.ActionProps = $props();
+	}: AlertDialogPrimitive.CancelProps & {
+		variant?: ButtonVariant;
+		size?: ButtonSize;
+	} = $props();
 </script>
 
-<AlertDialogPrimitive.Action
+<AlertDialogPrimitive.Cancel
 	bind:ref
-	data-slot="alert-dialog-action"
-	class={cn(buttonVariants(), className)}
+	data-slot="alert-dialog-cancel"
+	class={cn(buttonVariants({ variant, size }), "cn-alert-dialog-cancel", className)}
 	{...restProps}
 />
```

## aspect-ratio

```diff
```

## avatar

```diff
--- /tmp/shadcn-diffs/avatar-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/avatar/avatar.svelte	2026-04-06 22:52:05
@@ -1,17 +1,26 @@
 <script lang="ts">
 	import { Avatar as AvatarPrimitive } from "bits-ui";
-	import { cn } from "$UTILS$.js";
+	import { cn } from "$lib/utils.js";
 
 	let {
 		ref = $bindable(null),
+		loadingStatus = $bindable("loading"),
+		size = "default",
 		class: className,
 		...restProps
-	}: AvatarPrimitive.FallbackProps = $props();
+	}: AvatarPrimitive.RootProps & {
+		size?: "default" | "sm" | "lg";
+	} = $props();
 </script>
 
-<AvatarPrimitive.Fallback
+<AvatarPrimitive.Root
 	bind:ref
-	data-slot="avatar-fallback"
-	class={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
+	bind:loadingStatus
+	data-slot="avatar"
+	data-size={size}
+	class={cn(
+		"size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten",
+		className
+	)}
 	{...restProps}
 />
```

## badge

```diff
--- /tmp/shadcn-diffs/badge-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/badge/badge.svelte	2026-04-06 22:52:05
@@ -2,16 +2,15 @@
 	import { type VariantProps, tv } from "tailwind-variants";
 
 	export const badgeVariants = tv({
-		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
+		base: "h-5 gap-1 rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-2.5! focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none",
 		variants: {
 			variant: {
-				default:
-					"bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
-				secondary:
-					"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
-				destructive:
-					"bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white",
-				outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
+				default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
+				secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
+				destructive: "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
+				outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground bg-input/20 dark:bg-input/30",
+				ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
+				link: "text-primary underline-offset-4 hover:underline",
 			},
 		},
 		defaultVariants: {
@@ -24,7 +23,7 @@
 
 <script lang="ts">
 	import type { HTMLAnchorAttributes } from "svelte/elements";
-	import { cn, type WithElementRef } from "$UTILS$.js";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 
 	let {
 		ref = $bindable(null),
```

## breadcrumb

```diff
--- /tmp/shadcn-diffs/breadcrumb-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/breadcrumb/breadcrumb-item.svelte	2026-04-06 22:52:05
@@ -1,23 +1,20 @@
 <script lang="ts">
-	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
-	import type { HTMLAttributes } from "svelte/elements";
-	import { cn, type WithElementRef, type WithoutChildren } from "$UTILS$.js";
+	import type { HTMLLiAttributes } from "svelte/elements";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 
 	let {
 		ref = $bindable(null),
 		class: className,
+		children,
 		...restProps
-	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props();
+	}: WithElementRef<HTMLLiAttributes> = $props();
 </script>
 
-<span
+<li
 	bind:this={ref}
-	data-slot="breadcrumb-ellipsis"
-	role="presentation"
-	aria-hidden="true"
-	class={cn("flex size-9 items-center justify-center", className)}
+	data-slot="breadcrumb-item"
+	class={cn("gap-1 inline-flex items-center", className)}
 	{...restProps}
 >
-	<EllipsisIcon class="size-4" />
-	<span class="sr-only">More</span>
-</span>
+	{@render children?.()}
+</li>
```

## button

```diff
--- /tmp/shadcn-diffs/button-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/button/button.svelte	2026-04-06 22:52:05
@@ -1,28 +1,28 @@
 <script lang="ts" module>
-	import { cn, type WithElementRef } from "$UTILS$.js";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
 	import { type VariantProps, tv } from "tailwind-variants";
 
 	export const buttonVariants = tv({
-		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
+		base: "focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium focus-visible:ring-2 active:not-aria-[haspopup]:translate-y-px aria-invalid:ring-2 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
 		variants: {
 			variant: {
-				default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
-				destructive:
-					"bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs",
-				outline:
-					"bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs",
-				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
-				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
+				default: "bg-primary text-primary-foreground hover:bg-primary/80",
+				outline: "border-border dark:bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
+				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
+				ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
+				destructive: "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
 				link: "text-primary underline-offset-4 hover:underline",
 			},
 			size: {
-				default: "h-9 px-4 py-2 has-[>svg]:px-3",
-				sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
-				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
-				icon: "size-9",
-				"icon-sm": "size-8",
-				"icon-lg": "size-10",
+				default: "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
+				xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
+				sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
+				lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
+				icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
+				"icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
+				"icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
+				"icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
 			},
 		},
 		defaultVariants: {
```

## button-group

```diff
--- /tmp/shadcn-diffs/button-group-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/button-group/button-group-separator.svelte	2026-04-06 22:52:05
@@ -1,7 +1,7 @@
 <script lang="ts">
-	import { cn } from "$UTILS$.js";
+	import { cn } from "$lib/utils.js";
 	import type { ComponentProps } from "svelte";
-	import { Separator } from "$UI$/separator/index.js";
+	import { Separator } from "$lib/components/ui/separator/index.js";
 
 	let {
 		ref = $bindable(null),
@@ -15,6 +15,9 @@
 	bind:ref
 	data-slot="button-group-separator"
 	{orientation}
-	class={cn("bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto", className)}
+	class={cn(
+		"bg-input relative self-stretch data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto",
+		className
+	)}
 	{...restProps}
 />
```

## calendar

```diff
--- /tmp/shadcn-diffs/calendar-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/calendar/calendar-header.svelte	2026-04-06 22:52:05
@@ -1,76 +1,19 @@
 <script lang="ts">
-	import type { ComponentProps } from "svelte";
-	import type Calendar from "./calendar.svelte";
-	import CalendarMonthSelect from "./calendar-month-select.svelte";
-	import CalendarYearSelect from "./calendar-year-select.svelte";
-	import { DateFormatter, getLocalTimeZone, type DateValue } from "@internationalized/date";
+	import { Calendar as CalendarPrimitive } from "bits-ui";
+	import { cn } from "$lib/utils.js";
 
 	let {
-		captionLayout,
-		months,
-		monthFormat,
-		years,
-		yearFormat,
-		month,
-		locale,
-		placeholder = $bindable(),
-		monthIndex = 0,
-	}: {
-		captionLayout: ComponentProps<typeof Calendar>["captionLayout"];
-		months: ComponentProps<typeof CalendarMonthSelect>["months"];
-		monthFormat: ComponentProps<typeof CalendarMonthSelect>["monthFormat"];
-		years: ComponentProps<typeof CalendarYearSelect>["years"];
-		yearFormat: ComponentProps<typeof CalendarYearSelect>["yearFormat"];
-		month: DateValue;
-		placeholder: DateValue | undefined;
-		locale: string;
-		monthIndex: number;
-	} = $props();
-
-	function formatYear(date: DateValue) {
-		const dateObj = date.toDate(getLocalTimeZone());
-		if (typeof yearFormat === "function") return yearFormat(dateObj.getFullYear());
-		return new DateFormatter(locale, { year: yearFormat }).format(dateObj);
-	}
-
-	function formatMonth(date: DateValue) {
-		const dateObj = date.toDate(getLocalTimeZone());
-		if (typeof monthFormat === "function") return monthFormat(dateObj.getMonth() + 1);
-		return new DateFormatter(locale, { month: monthFormat }).format(dateObj);
-	}
+		ref = $bindable(null),
+		class: className,
+		...restProps
+	}: CalendarPrimitive.HeaderProps = $props();
 </script>
 
-{#snippet MonthSelect()}
-	<CalendarMonthSelect
-		{months}
-		{monthFormat}
-		value={month.month}
-		onchange={(e) => {
-			if (!placeholder) return;
-			const v = Number.parseInt(e.currentTarget.value);
-			const newPlaceholder = placeholder.set({ month: v });
-			placeholder = newPlaceholder.subtract({ months: monthIndex });
-		}}
-	/>
-{/snippet}
-
-{#snippet YearSelect()}
-	<CalendarYearSelect {years} {yearFormat} value={month.year} />
-{/snippet}
-
-{#if captionLayout === "dropdown"}
-	{@render MonthSelect()}
-	{@render YearSelect()}
-{:else if captionLayout === "dropdown-months"}
-	{@render MonthSelect()}
-	{#if placeholder}
-		{formatYear(placeholder)}
-	{/if}
-{:else if captionLayout === "dropdown-years"}
-	{#if placeholder}
-		{formatMonth(placeholder)}
-	{/if}
-	{@render YearSelect()}
-{:else}
-	{formatMonth(month)} {formatYear(month)}
-{/if}
+<CalendarPrimitive.Header
+	bind:ref
+	class={cn(
+		"flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
+		className
+	)}
+	{...restProps}
+/>
```

## card

```diff
--- /tmp/shadcn-diffs/card-registry.svelte	2026-04-07 10:47:24
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/card/card-title.svelte	2026-04-06 22:52:05
@@ -1,6 +1,6 @@
 <script lang="ts">
-	import { cn, type WithElementRef } from "$UTILS$.js";
 	import type { HTMLAttributes } from "svelte/elements";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 
 	let {
 		ref = $bindable(null),
@@ -12,8 +12,8 @@
 
 <div
 	bind:this={ref}
-	data-slot="card-action"
-	class={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
+	data-slot="card-title"
+	class={cn("text-sm font-medium", className)}
 	{...restProps}
 >
 	{@render children?.()}
```

## carousel

```diff
--- /tmp/shadcn-diffs/carousel-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/carousel/carousel-content.svelte	2026-04-06 22:52:05
@@ -1,28 +1,43 @@
 <script lang="ts">
 	import emblaCarouselSvelte from "embla-carousel-svelte";
+	import { tv } from "tailwind-variants";
 	import type { HTMLAttributes } from "svelte/elements";
 	import { getEmblaContext } from "./context.js";
-	import { cn, type WithElementRef } from "$UTILS$.js";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 
+	const container = tv({
+		base: "flex",
+		variants: {
+			orientation: {
+				horizontal: "-ml-4",
+				vertical: "-mt-4 flex-col",
+			},
+		},
+		defaultVariants: {
+			orientation: "horizontal",
+		},
+	});
+
 	let {
 		ref = $bindable(null),
 		class: className,
+		viewportClass,
 		children,
 		...restProps
-	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
+	}: WithElementRef<HTMLAttributes<HTMLDivElement> & { viewportClass?: string }> = $props();
 
 	const emblaCtx = getEmblaContext("<Carousel.Content/>");
+	const axis = $derived(emblaCtx.orientation === "horizontal" ? "x" : "y");
 </script>
 
 <div
-	data-slot="carousel-content"
-	class="overflow-hidden"
+	class={cn("overflow-hidden", viewportClass)}
 	use:emblaCarouselSvelte={{
 		options: {
 			container: "[data-embla-container]",
 			slides: "[data-embla-slide]",
 			...emblaCtx.options,
-			axis: emblaCtx.orientation === "horizontal" ? "x" : "y",
+			axis,
 		},
 		plugins: emblaCtx.plugins,
 	}}
@@ -30,11 +45,8 @@
 >
 	<div
 		bind:this={ref}
-		class={cn(
-			"flex",
-			emblaCtx.orientation === "horizontal" ? "-ms-4" : "-mt-4 flex-col",
-			className
-		)}
+		data-slot="carousel-content"
+		class={cn(container({ orientation: emblaCtx.orientation }), className)}
 		data-embla-container=""
 		{...restProps}
 	>
```

## chart

```diff
--- /tmp/shadcn-diffs/chart-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/chart/chart-container.svelte	2026-04-06 22:52:05
@@ -1,5 +1,5 @@
 <script lang="ts">
-	import { cn, type WithElementRef } from "$UTILS$.js";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 	import type { HTMLAttributes } from "svelte/elements";
 	import ChartStyle from "./chart-style.svelte";
 	import { setChartContext, type ChartConfig } from "./chart-utils.js";
@@ -17,7 +17,7 @@
 		config: ChartConfig;
 	} = $props();
 
-	const chartId = `chart-${id || uid.replace(/:/g, "")}`;
+	const chartId = $derived(`chart-${id || uid.replace(/:/g, "")}`);
 
 	setChartContext({
 		get config() {
```

## checkbox

```diff
--- /tmp/shadcn-diffs/checkbox-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/checkbox/checkbox.svelte	2026-04-06 22:52:05
@@ -1,8 +1,8 @@
 <script lang="ts">
 	import { Checkbox as CheckboxPrimitive } from "bits-ui";
-	import CheckIcon from "@lucide/svelte/icons/check";
-	import MinusIcon from "@lucide/svelte/icons/minus";
-	import { cn, type WithoutChildrenOrChild } from "$UTILS$.js";
+	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
+	import CheckIcon from '@lucide/svelte/icons/check';
+	import MinusIcon from '@lucide/svelte/icons/minus';
 
 	let {
 		ref = $bindable(null),
@@ -17,19 +17,22 @@
 	bind:ref
 	data-slot="checkbox"
 	class={cn(
-		"border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
+		"border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:data-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-[4px] border transition-shadow group-has-disabled/field:opacity-50 focus-visible:ring-2 aria-invalid:ring-2 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
 		className
 	)}
 	bind:checked
 	bind:indeterminate
 	{...restProps}
 >
-	{#snippet children({ checked, indeterminate })}
-		<div data-slot="checkbox-indicator" class="text-current transition-none">
-			{#if checked}
-				<CheckIcon class="size-3.5" />
-			{:else if indeterminate}
-				<MinusIcon class="size-3.5" />
+	{#snippet children({ checked: isChecked, indeterminate: isIndeterminate })}
+		<div
+			data-slot="checkbox-indicator"
+			class="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
+		>
+			{#if isChecked}
+				<CheckIcon  />
+			{:else if isIndeterminate}
+				<MinusIcon  />
 			{/if}
 		</div>
 	{/snippet}
```

## collapsible

```diff
--- /tmp/shadcn-diffs/collapsible-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/collapsible/collapsible-trigger.svelte	2026-04-06 22:52:05
@@ -1,7 +1,7 @@
 <script lang="ts">
 	import { Collapsible as CollapsiblePrimitive } from "bits-ui";
 
-	let { ref = $bindable(null), ...restProps }: CollapsiblePrimitive.ContentProps = $props();
+	let { ref = $bindable(null), ...restProps }: CollapsiblePrimitive.TriggerProps = $props();
 </script>
 
-<CollapsiblePrimitive.Content bind:ref data-slot="collapsible-content" {...restProps} />
+<CollapsiblePrimitive.Trigger bind:ref data-slot="collapsible-trigger" {...restProps} />
```

## command

```diff
--- /tmp/shadcn-diffs/command-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/command/command-link-item.svelte	2026-04-06 22:52:05
@@ -1,40 +1,20 @@
 <script lang="ts">
-	import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from "bits-ui";
-	import type { Snippet } from "svelte";
-	import Command from "./command.svelte";
-	import * as Dialog from "$UI$/dialog/index.js";
-	import type { WithoutChildrenOrChild } from "$UTILS$.js";
+	import { Command as CommandPrimitive } from "bits-ui";
+	import { cn } from "$lib/utils.js";
 
 	let {
-		open = $bindable(false),
 		ref = $bindable(null),
-		value = $bindable(""),
-		title = "Command Palette",
-		description = "Search for a command to run",
-		portalProps,
-		children,
+		class: className,
 		...restProps
-	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
-		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
-			portalProps?: DialogPrimitive.PortalProps;
-			children: Snippet;
-			title?: string;
-			description?: string;
-		} = $props();
+	}: CommandPrimitive.LinkItemProps = $props();
 </script>
 
-<Dialog.Root bind:open {...restProps}>
-	<Dialog.Header class="sr-only">
-		<Dialog.Title>{title}</Dialog.Title>
-		<Dialog.Description>{description}</Dialog.Description>
-	</Dialog.Header>
-	<Dialog.Content class="overflow-hidden p-0" {portalProps}>
-		<Command
-			class="**:data-[slot=command-input-wrapper]:h-12 [&_[data-command-group]]:px-2 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
-			{...restProps}
-			bind:value
-			bind:ref
-			{children}
-		/>
-	</Dialog.Content>
-</Dialog.Root>
+<CommandPrimitive.LinkItem
+	bind:ref
+	data-slot="command-link-item"
+	class={cn(
+		"data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
+		className
+	)}
+	{...restProps}
+/>
```

## context-menu

```diff
--- /tmp/shadcn-diffs/context-menu-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/context-menu/context-menu-radio-item.svelte	2026-04-06 22:52:05
@@ -1,40 +1,35 @@
 <script lang="ts">
 	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
-	import CheckIcon from "@lucide/svelte/icons/check";
-	import { cn, type WithoutChildrenOrChild } from "$UTILS$.js";
-	import type { Snippet } from "svelte";
+	import { cn, type WithoutChild } from "$lib/utils.js";
+	import CheckIcon from '@lucide/svelte/icons/check';
 
 	let {
 		ref = $bindable(null),
-		checked = $bindable(false),
-		indeterminate = $bindable(false),
 		class: className,
+		inset,
 		children: childrenProp,
 		...restProps
-	}: WithoutChildrenOrChild<ContextMenuPrimitive.CheckboxItemProps> & {
-		children?: Snippet;
+	}: WithoutChild<ContextMenuPrimitive.RadioItemProps> & {
+		inset?: boolean;
 	} = $props();
 </script>
 
-<ContextMenuPrimitive.CheckboxItem
+<ContextMenuPrimitive.RadioItem
 	bind:ref
-	bind:checked
-	bind:indeterminate
-	data-slot="context-menu-checkbox-item"
+	data-slot="context-menu-radio-item"
+	data-inset={inset}
 	class={cn(
-		"data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
+		"focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground min-h-7 gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm data-inset:pl-7.5 [&_svg:not([class*='size-'])]:size-3.5 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
 		className
 	)}
 	{...restProps}
 >
 	{#snippet children({ checked })}
-		<span
-			class="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center"
-		>
+		<span class="pointer-events-none absolute right-2 flex items-center justify-center">
 			{#if checked}
-				<CheckIcon class="size-4" />
+				<CheckIcon  />
 			{/if}
 		</span>
-		{@render childrenProp?.()}
+		{@render childrenProp?.({ checked })}
 	{/snippet}
-</ContextMenuPrimitive.CheckboxItem>
+</ContextMenuPrimitive.RadioItem>
```

## data-table

```diff
--- /tmp/shadcn-diffs/data-table-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/data-table/flex-render.svelte	2026-04-06 22:52:05
@@ -1,142 +1,40 @@
-import {
-	type RowData,
-	type TableOptions,
-	type TableOptionsResolved,
-	type TableState,
-	type Updater,
-	createTable,
-} from "@tanstack/table-core";
+<script
+	lang="ts"
+	generics="TData, TValue, TContext extends HeaderContext<TData, TValue> | CellContext<TData, TValue>"
+>
+	import type { CellContext, ColumnDefTemplate, HeaderContext } from "@tanstack/table-core";
+	import { RenderComponentConfig, RenderSnippetConfig } from "./render-helpers.js";
+	import type { Attachment } from "svelte/attachments";
+	type Props = {
+		/** The cell or header field of the current cell's column definition. */
+		content?: TContext extends HeaderContext<TData, TValue>
+			? ColumnDefTemplate<HeaderContext<TData, TValue>>
+			: TContext extends CellContext<TData, TValue>
+				? ColumnDefTemplate<CellContext<TData, TValue>>
+				: never;
+		/** The result of the `getContext()` function of the header or cell */
+		context: TContext;
 
-/**
- * Creates a reactive TanStack table object for Svelte.
- * @param options Table options to create the table with.
- * @returns A reactive table object.
- * @example
- * ```svelte
- * <script>
- *   const table = createSvelteTable({ ... })
- * </script>
- *
- * <table>
- *   <thead>
- *     {#each table.getHeaderGroups() as headerGroup}
- *       <tr>
- *         {#each headerGroup.headers as header}
- *           <th colspan={header.colSpan}>
- *         	   <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
- *         	 </th>
- *         {/each}
- *       </tr>
- *     {/each}
- *   </thead>
- * 	 <!-- ... -->
- * </table>
- * ```
- */
-export function createSvelteTable<TData extends RowData>(options: TableOptions<TData>) {
-	const resolvedOptions: TableOptionsResolved<TData> = mergeObjects(
-		{
-			state: {},
-			onStateChange() {},
-			renderFallbackValue: null,
-			mergeOptions: (
-				defaultOptions: TableOptions<TData>,
-				options: Partial<TableOptions<TData>>
-			) => {
-				return mergeObjects(defaultOptions, options);
-			},
-		},
-		options
-	);
-
-	const table = createTable(resolvedOptions);
-	let state = $state<TableState>(table.initialState);
-
-	function updateOptions() {
-		table.setOptions(() => {
-			return mergeObjects(resolvedOptions, options, {
-				state: mergeObjects(state, options.state || {}),
-
-				onStateChange: (updater: Updater<TableState>) => {
-					if (updater instanceof Function) state = updater(state);
-					else state = mergeObjects(state, updater);
-
-					options.onStateChange?.(updater);
-				},
-			});
-		});
-	}
-
-	updateOptions();
-
-	$effect.pre(() => {
-		updateOptions();
-	});
-
-	return table;
-}
-
-type MaybeThunk<T extends object> = T | (() => T | null | undefined);
-type Intersection<T extends readonly unknown[]> = (T extends [infer H, ...infer R]
-	? H & Intersection<R>
-	: unknown) & {};
-
-/**
- * Lazily merges several objects (or thunks) while preserving
- * getter semantics from every source.
- *
- * Proxy-based to avoid known WebKit recursion issue.
- */
-// eslint-disable-next-line @typescript-eslint/no-explicit-any
-export function mergeObjects<Sources extends readonly MaybeThunk<any>[]>(
-	...sources: Sources
-): Intersection<{ [K in keyof Sources]: Sources[K] }> {
-	const resolve = <T extends object>(src: MaybeThunk<T>): T | undefined =>
-		typeof src === "function" ? (src() ?? undefined) : src;
-
-	const findSourceWithKey = (key: PropertyKey) => {
-		for (let i = sources.length - 1; i >= 0; i--) {
-			const obj = resolve(sources[i]);
-			if (obj && key in obj) return obj;
-		}
-		return undefined;
+		/** Used to pass attachments that can't be gotten through context */
+		attach?: Attachment;
 	};
 
-	return new Proxy(Object.create(null), {
-		get(_, key) {
-			const src = findSourceWithKey(key);
+	let { content, context, attach }: Props = $props();
+</script>
 
-			return src?.[key as never];
-		},
-
-		has(_, key) {
-			return !!findSourceWithKey(key);
-		},
-
-		ownKeys(): (string | symbol)[] {
-			// eslint-disable-next-line svelte/prefer-svelte-reactivity
-			const all = new Set<string | symbol>();
-			for (const s of sources) {
-				const obj = resolve(s);
-				if (obj) {
-					for (const k of Reflect.ownKeys(obj) as (string | symbol)[]) {
-						all.add(k);
-					}
-				}
-			}
-			return [...all];
-		},
-
-		getOwnPropertyDescriptor(_, key) {
-			const src = findSourceWithKey(key);
-			if (!src) return undefined;
-			return {
-				configurable: true,
-				enumerable: true,
-				// eslint-disable-next-line @typescript-eslint/no-explicit-any
-				value: (src as any)[key],
-				writable: true,
-			};
-		},
-	}) as Intersection<{ [K in keyof Sources]: Sources[K] }>;
-}
+{#if typeof content === "string"}
+	{content}
+{:else if content instanceof Function}
+	<!-- It's unlikely that a CellContext will be passed to a Header -->
+	<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
+	{@const result = content(context as any)}
+	{#if result instanceof RenderComponentConfig}
+		{@const { component: Component, props } = result}
+		<Component {...props} {attach} />
+	{:else if result instanceof RenderSnippetConfig}
+		{@const { snippet, params } = result}
+		{@render snippet({ ...params, attach })}
+	{:else}
+		{result}
+	{/if}
+{/if}
```

## dialog

```diff
--- /tmp/shadcn-diffs/dialog-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/dialog/dialog-trigger.svelte	2026-04-06 22:52:05
@@ -1,7 +1,11 @@
 <script lang="ts">
 	import { Dialog as DialogPrimitive } from "bits-ui";
 
-	let { ref = $bindable(null), ...restProps }: DialogPrimitive.CloseProps = $props();
+	let {
+		ref = $bindable(null),
+		type = "button",
+		...restProps
+	}: DialogPrimitive.TriggerProps = $props();
 </script>
 
-<DialogPrimitive.Close bind:ref data-slot="dialog-close" {...restProps} />
+<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {type} {...restProps} />
```

## drawer

```diff
--- /tmp/shadcn-diffs/drawer-registry.svelte	2026-04-07 10:47:25
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/drawer/drawer-nested.svelte	2026-04-06 22:52:05
@@ -1,7 +1,12 @@
 <script lang="ts">
 	import { Drawer as DrawerPrimitive } from "vaul-svelte";
 
-	let { ref = $bindable(null), ...restProps }: DrawerPrimitive.CloseProps = $props();
+	let {
+		shouldScaleBackground = true,
+		open = $bindable(false),
+		activeSnapPoint = $bindable(null),
+		...restProps
+	}: DrawerPrimitive.RootProps = $props();
 </script>
 
-<DrawerPrimitive.Close bind:ref data-slot="drawer-close" {...restProps} />
+<DrawerPrimitive.NestedRoot {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps} />
```

## dropdown-menu

```diff
--- /tmp/shadcn-diffs/dropdown-menu-registry.svelte	2026-04-07 10:47:26
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/dropdown-menu/dropdown-menu-sub.svelte	2026-04-06 22:52:05
@@ -1,16 +1,7 @@
 <script lang="ts">
 	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
 
-	let {
-		ref = $bindable(null),
-		value = $bindable([]),
-		...restProps
-	}: DropdownMenuPrimitive.CheckboxGroupProps = $props();
+	let { open = $bindable(false), ...restProps }: DropdownMenuPrimitive.SubProps = $props();
 </script>
 
-<DropdownMenuPrimitive.CheckboxGroup
-	bind:ref
-	bind:value
-	data-slot="dropdown-menu-checkbox-group"
-	{...restProps}
-/>
+<DropdownMenuPrimitive.Sub bind:open {...restProps} />
```

## empty

```diff
--- /tmp/shadcn-diffs/empty-registry.svelte	2026-04-07 10:47:26
+++ /Users/guillaume/projects/Perso/Alphamix/packages/ui/src/lib/components/ui/empty/empty.svelte	2026-04-06 22:52:05
@@ -1,5 +1,5 @@
 <script lang="ts">
-	import { cn, type WithElementRef } from "$UTILS$.js";
+	import { cn, type WithElementRef } from "$lib/utils.js";
 	import type { HTMLAttributes } from "svelte/elements";
 
 	let {
@@ -12,9 +12,9 @@
 
 <div
 	bind:this={ref}
-	data-slot="empty-content"
+	data-slot="empty"
 	class={cn(
-		"flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
+		"gap-4 rounded-xl border-dashed p-6 flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance",
 		className
 	)}
 	{...restProps}
```

