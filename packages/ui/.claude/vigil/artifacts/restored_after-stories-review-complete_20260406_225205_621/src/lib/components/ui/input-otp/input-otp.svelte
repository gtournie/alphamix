<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		style: styleProp,
		...restProps
	}: InputOTPPrimitive.RootProps = $props();

	const disabledStyle = $derived(restProps.disabled ? "cursor: not-allowed;" : "");
</script>

<InputOTPPrimitive.Root
	bind:ref
	bind:value
	data-slot="input-otp"
	spellcheck={false}
	style={[disabledStyle, styleProp].filter(Boolean).join(" ")}
	class={cn(
		"cn-input-otp-input gap-2 flex items-center has-disabled:opacity-50",
		className
	)}
	{...restProps}
/>
