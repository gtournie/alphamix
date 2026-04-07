<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
	import { CalendarDate } from "@internationalized/date";

	const initialValue = {
		start: new CalendarDate(2025, 1, 20),
		end: new CalendarDate(2025, 1, 26),
	};

	const { Story } = defineMeta({
		title: "UI/RangeCalendar",
		component: RangeCalendar,
		tags: ["autodocs"],
		argTypes: {
			disabled: { control: "boolean" },
			captionLayout: {
				control: "select",
				options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
			},
			numberOfMonths: { control: { type: "number", min: 1, max: 4 } },
			locale: { control: "text" },
			weekdayFormat: {
				control: "select",
				options: ["narrow", "short", "long"],
			},
			buttonVariant: {
				control: "select",
				options: [
					"default",
					"destructive",
					"outline",
					"secondary",
					"ghost",
					"link",
				],
			},
			disableDaysOutsideMonth: { control: "boolean" },
			yearFormat: { control: "select", options: ["numeric", "2-digit"] },
			monthFormat: {
				control: "select",
				options: ["narrow", "short", "long", "numeric", "2-digit"],
				description:
					'Defaults to "short" when captionLayout is a dropdown variant and no value is set.',
			},
			value: { control: false, table: { disable: true } },
		},
		args: {
			disabled: false,
			captionLayout: "label",
			numberOfMonths: 1,
			locale: "en-US",
			weekdayFormat: "short",
			buttonVariant: "ghost",
			disableDaysOutsideMonth: false,
			yearFormat: "numeric",
			monthFormat: "long",
		},
	});
</script>

<Story name="Basic">
	{#snippet template(args)}
		<RangeCalendar {...args} value={initialValue} />
	{/snippet}
</Story>

<Story
	name="WithDropdown"
	args={{ captionLayout: "dropdown", monthFormat: "short" }}
>
	{#snippet template(args)}
		<RangeCalendar {...args} value={initialValue} />
	{/snippet}
</Story>

<Story name="MultipleMonths" args={{ numberOfMonths: 2 }}>
	{#snippet template(args)}
		<RangeCalendar {...args} value={initialValue} />
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true }}>
	{#snippet template(args)}
		<RangeCalendar {...args} value={initialValue} />
	{/snippet}
</Story>

<Story name="DisableDaysOutsideMonth" args={{ disableDaysOutsideMonth: true }}>
	{#snippet template(args)}
		<RangeCalendar {...args} value={initialValue} />
	{/snippet}
</Story>

<Story name="Long Weekdays" args={{ weekdayFormat: "long" }}>
	{#snippet template(args)}
		<RangeCalendar {...args} value={initialValue} />
	{/snippet}
</Story>

<Story name="Narrow Weekdays" args={{ weekdayFormat: "narrow" }}>
	{#snippet template(args)}
		<RangeCalendar {...args} value={initialValue} />
	{/snippet}
</Story>
