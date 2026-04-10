<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { cn } from "$lib/utils.js";
	import { DatePicker } from "$lib/components/ui/date-picker/index.js";
	import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import {
		CalendarDate,
		today,
		getLocalTimeZone,
		type DateValue,
	} from "@internationalized/date";
	import type { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";

	type DateRange = RangeCalendarPrimitive.RootProps["value"];

	const { Story } = defineMeta({
		title: "UI/Date Picker",
		component: DatePicker,
		tags: ["autodocs"],
		argTypes: {
			placeholder: { control: "text" },
			locale: { control: "text" },
			captionLayout: {
				control: "select",
				options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
			},
			buttonClass: { control: "text" },
			value: { control: false, table: { disable: true } },
			open: { control: false, table: { disable: true } },
		},
	});
</script>

<script lang="ts">
	const year = today(getLocalTimeZone()).year;

	// Basic
	let basicValue = $state<DateValue | undefined>();

	// Range Picker
	let rangeValue = $state<DateRange>({
		start: new CalendarDate(year, 1, 20),
		end: new CalendarDate(year, 2, 9),
	});
	let rangeOpen = $state(false);

	function formatDateRange(range: DateRange) {
		if (!range?.start) return "Pick a date";
		const fmt = (d: DateValue) =>
			d.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
				month: "short",
				day: "2-digit",
				year: "numeric",
			});
		return range.end ? `${fmt(range.start)} – ${fmt(range.end)}` : fmt(range.start);
	}

	// Date of Birth
	let dobValue = $state<DateValue | undefined>();
	let dobOpen = $state(false);

	// Input
	let inputDate = $state<DateValue | undefined>(new CalendarDate(year, 6, 1));
	let inputOpen = $state(false);

	function formatDateLong(date: DateValue | undefined) {
		if (!date) return "";
		return date.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	}

	// inputValue is kept in sync manually: calendar writes via onValueChange,
	// text input writes via handleInputChange. Not $derived because the user
	// can freely type without an immediate calendar selection.
	let inputValue = $state(formatDateLong(inputDate));

	function handleInputChange(raw: string) {
		inputValue = raw;
		// new Date() parses non-ISO strings (e.g. "June 01, 2025") as local time,
		// so local .getFullYear()/.getMonth()/.getDate() are consistent here.
		const parsed = new Date(raw);
		if (!isNaN(parsed.getTime())) {
			inputDate = new CalendarDate(
				parsed.getFullYear(),
				parsed.getMonth() + 1,
				parsed.getDate(),
			);
		}
	}

	// Time Picker
	let timeDate = $state<DateValue | undefined>();
	let timeOpen = $state(false);
	let timeValue = $state("10:30:00");
</script>

<Story name="Basic">
	{#snippet template()}
		<Field.Field class="mx-auto w-44">
			<Field.Label>Date</Field.Label>
			<DatePicker bind:value={basicValue} placeholder="Pick a date" buttonClass="w-full" />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Range Picker">
	{#snippet template()}
		<Field.Field class="mx-auto w-60">
			<Field.Label for="date-range">Date Range</Field.Label>
			<Popover.Root bind:open={rangeOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							id="date-range"
							variant="outline"
							class="w-full justify-start px-2.5 font-normal"
						>
							<CalendarIcon class="me-2 size-4" />
							{formatDateRange(rangeValue)}
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" align="start">
					<RangeCalendar
						bind:value={rangeValue}
						numberOfMonths={2}
						onValueChange={(v) => {
							if (v?.start && v?.end) rangeOpen = false;
						}}
					/>
				</Popover.Content>
			</Popover.Root>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Date of Birth">
	{#snippet template()}
		<Field.Field class="mx-auto w-44">
			<Field.Label for="date-dob">Date of birth</Field.Label>
			<Popover.Root bind:open={dobOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							id="date-dob"
							variant="outline"
							class={cn("w-full justify-start font-normal", !dobValue && "text-muted-foreground")}
						>
							{dobValue
								? dobValue.toDate(getLocalTimeZone()).toLocaleDateString()
								: "Select date"}
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto overflow-hidden p-0" align="start">
					<Calendar
						bind:value={dobValue}
						type="single"
						captionLayout="dropdown"
						onValueChange={() => {
							dobOpen = false;
						}}
					/>
				</Popover.Content>
			</Popover.Root>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Input">
	{#snippet template()}
		<Field.Field class="mx-auto w-48">
			<Field.Label for="date-input">Subscription Date</Field.Label>
			<InputGroup.Root>
				<InputGroup.Input
					id="date-input"
					value={inputValue}
					placeholder="June 01, 2025"
					oninput={(e) => handleInputChange((e.currentTarget as HTMLInputElement).value)}
					onkeydown={(e) => {
						if (e.key === "ArrowDown") {
							e.preventDefault();
							inputOpen = true;
						}
					}}
				/>
				<InputGroup.Addon align="inline-end">
					<Popover.Root bind:open={inputOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<InputGroup.Button
									{...props}
									variant="ghost"
									size="icon-xs"
									aria-label="Select date"
								>
									<CalendarIcon />
									<span class="sr-only">Select date</span>
								</InputGroup.Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto overflow-hidden p-0" align="end">
							<Calendar
								bind:value={inputDate}
								type="single"
								onValueChange={(v) => {
									inputValue = formatDateLong(v);
									inputOpen = false;
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Time Picker">
	{#snippet template()}
		<Field.Group class="mx-auto max-w-xs flex-row">
			<Field.Field>
				<Field.Label for="date-time">Date</Field.Label>
				<Popover.Root bind:open={timeOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								id="date-time"
								variant="outline"
								class={cn(
									"w-32 justify-between font-normal",
									!timeDate && "text-muted-foreground",
								)}
							>
								{timeDate
									? timeDate.toDate(getLocalTimeZone()).toLocaleDateString()
									: "Select date"}
								<ChevronDownIcon />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto overflow-hidden p-0" align="start">
						<Calendar
							bind:value={timeDate}
							type="single"
							captionLayout="dropdown"
							onValueChange={() => {
								timeOpen = false;
							}}
						/>
					</Popover.Content>
				</Popover.Root>
			</Field.Field>
			<Field.Field class="w-32">
				<Field.Label for="time-picker">Time</Field.Label>
				<Input
					id="time-picker"
					type="time"
					step="1"
					bind:value={timeValue}
					class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</Field.Field>
		</Field.Group>
	{/snippet}
</Story>
