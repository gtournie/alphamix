<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import {
		RangeCalendar,
		Day as RangeCalendarDay,
	} from "$lib/components/ui/range-calendar/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import {
		CalendarDate,
		today,
		getLocalTimeZone,
	} from "@internationalized/date";
	import Clock2Icon from "@lucide/svelte/icons/clock-2";

	const { Story } = defineMeta({
		title: "UI/Calendar",
		component: Calendar,
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
			},
			showWeekNumber: { control: "boolean" },
			value: { control: false, table: { disable: true } },
		},
	});
</script>

<script lang="ts">
	import type { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import type { DateValue } from "@internationalized/date";

	type DateRange = RangeCalendarPrimitive.RootProps["value"];

	const year = today(getLocalTimeZone()).year;

	// Range Calendar — Jan 12 to Feb 11 (Jan 12 + 30 days), overflows to next month
	let rangeValue = $state<DateRange>({
		start: new CalendarDate(year, 1, 12),
		end: new CalendarDate(year, 2, 11),
	});

	// Presets
	let presetsDate = $state<CalendarDate>(new CalendarDate(year, 2, 12));

	function applyPreset(days: number) {
		presetsDate = today(getLocalTimeZone()).add({ days }) as CalendarDate;
	}

	// Date and Time Picker — 12th of current month
	let dateTimeDate = $state<CalendarDate>(
		new CalendarDate(year, today(getLocalTimeZone()).month, 12),
	);

	// Booked Dates — Jan 6 selected, Jan 12–26 unavailable (line-through), placeholder anchors to January
	let bookedValue = $state<CalendarDate>(new CalendarDate(year, 1, 6));
	let bookedPlaceholder = $state<CalendarDate>(new CalendarDate(year, 1, 1));
	const bookedDates = Array.from(
		{ length: 15 },
		(_, i) => new CalendarDate(year, 1, 12 + i),
	);
	function isBooked(date: DateValue): boolean {
		return bookedDates.some(
			(d) =>
				d.year === date.year && d.month === date.month && d.day === date.day,
		);
	}

	// Custom Cell Size — Dec 8 to Dec 18
	let customRangeValue = $state<DateRange>({
		start: new CalendarDate(year, 12, 8),
		end: new CalendarDate(year, 12, 18),
	});

	// Date and Time Picker — time values
	let startTime = $state("10:30:00");
	let endTime = $state("12:30:00");

	// Week Numbers — Jan 12
	let weekNumbersDate = $state<CalendarDate>(new CalendarDate(year, 1, 12));
</script>

<Story name="Basic">
	{#snippet template()}
		<Calendar class="rounded-md border" />
	{/snippet}
</Story>

<Story name="Range Calendar">
	{#snippet template()}
		<Card.Root class="mx-auto w-fit p-0">
			<Card.Content class="p-0">
				<RangeCalendar
					bind:value={rangeValue}
					class="rounded-lg"
					numberOfMonths={2}
				/>
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Month and Year Selector">
	{#snippet template()}
		<Calendar captionLayout="dropdown" class="rounded-md border" />
	{/snippet}
</Story>

<Story name="Presets">
	{#snippet template()}
		<Card.Root class="mx-auto w-fit max-w-75">
			<Card.Content>
				<Calendar
					type="single"
					bind:value={presetsDate}
					class="p-0 [--cell-size:--spacing(9.5)]"
					fixedWeeks
				/>
			</Card.Content>
			<Card.Footer class="flex flex-wrap gap-2 border-t">
				{#each [{ label: "Today", value: 0 }, { label: "Tomorrow", value: 1 }, { label: "In 3 days", value: 3 }, { label: "In a week", value: 7 }, { label: "In 2 weeks", value: 14 }] as preset (preset.value)}
					<Button
						variant="outline"
						size="sm"
						class="flex-1"
						onclick={() => applyPreset(preset.value)}
					>
						{preset.label}
					</Button>
				{/each}
			</Card.Footer>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Date and Time Picker">
	{#snippet template()}
		<Card.Root class="mx-auto w-fit">
			<Card.Content>
				<Calendar type="single" bind:value={dateTimeDate} class="p-0" />
			</Card.Content>
			<Card.Footer class="border-t bg-card">
				<Field.Group>
					<Field.Field>
						<Field.Label for="start-time">Start Time</Field.Label>
						<InputGroup.Root>
							<InputGroup.Addon>
								<Clock2Icon />
							</InputGroup.Addon>
							<InputGroup.Input
								id="start-time"
								type="time"
								step="1"
								bind:value={startTime}
								class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
							/>
						</InputGroup.Root>
					</Field.Field>
					<Field.Field>
						<Field.Label for="end-time">End Time</Field.Label>
						<InputGroup.Root>
							<InputGroup.Addon>
								<Clock2Icon />
							</InputGroup.Addon>
							<InputGroup.Input
								id="end-time"
								type="time"
								step="1"
								bind:value={endTime}
								class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
							/>
						</InputGroup.Root>
					</Field.Field>
				</Field.Group>
			</Card.Footer>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Booked dates">
	{#snippet template()}
		<Card.Root class="mx-auto w-fit p-0">
			<Card.Content class="p-0">
				<Calendar
					type="single"
					bind:value={bookedValue}
					bind:placeholder={bookedPlaceholder}
					isDateUnavailable={isBooked}
				/>
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Custom Cell Size">
	{#snippet template()}
		{#snippet customDay({
			day: d,
			outsideMonth,
		}: {
			day: DateValue;
			outsideMonth: boolean;
		})}
			<RangeCalendarDay>
				{#snippet children({
					day: dayLabel,
				}: {
					day: string;
					disabled: boolean;
					unavailable: boolean;
					selected: boolean;
				})}
					{dayLabel}
					{#if !outsideMonth}
						<span>{d.dayOfWeek >= 6 ? "$120" : "$100"}</span>
					{/if}
				{/snippet}
			</RangeCalendarDay>
		{/snippet}
		<Card.Root class="mx-auto w-fit p-0">
			<Card.Content class="p-0">
				<RangeCalendar
					bind:value={customRangeValue}
					captionLayout="dropdown"
					monthFormat="long"
					class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
					day={customDay}
				/>
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Week Numbers">
	{#snippet template()}
		<Card.Root class="mx-auto w-fit p-0">
			<Card.Content class="p-0">
				<Calendar type="single" bind:value={weekNumbersDate} showWeekNumber />
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>
