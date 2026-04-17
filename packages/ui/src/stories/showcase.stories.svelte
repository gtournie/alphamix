<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";

	// Components
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import * as Accordion from "$lib/components/ui/accordion/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Spinner } from "$lib/components/ui/spinner/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";

	// Icons
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import InfoIcon from "@lucide/svelte/icons/info";
	import MailIcon from "@lucide/svelte/icons/mail";
	import MinusIcon from "@lucide/svelte/icons/minus";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import SearchIcon from "@lucide/svelte/icons/search";
	import SendIcon from "@lucide/svelte/icons/send";
	import UserPlusIcon from "@lucide/svelte/icons/user-plus";
	import BoldIcon from "@lucide/svelte/icons/bold";
	import ItalicIcon from "@lucide/svelte/icons/italic";
	import UnderlineIcon from "@lucide/svelte/icons/underline";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import MonitorIcon from "@lucide/svelte/icons/monitor";
	import LoaderIcon from "@lucide/svelte/icons/loader";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import PaperclipIcon from "@lucide/svelte/icons/paperclip";
	import StarIcon from "@lucide/svelte/icons/star";
	import GlobeIcon from "@lucide/svelte/icons/globe";

	const { Story } = defineMeta({
		title: "Showcase",
		parameters: {
			layout: "fullscreen",
			docs: {
				description: {
					component:
						"A comprehensive showcase of all UI components arranged in a realistic layout.",
				},
			},
		},
	});
</script>

<script lang="ts">
	let priceRange = $state([200, 600]);
	let gpuCount = $state(8);
	let computeEnv = $state("kubernetes");
	let wallpaperTinting = $state(true);
	let sameAsShipping = $state(true);
	let socialMedia = $state(true);
	let searchEngine = $state(true);
	let referral = $state(false);
	let other = $state(false);
	let progressValue = $state(52);
	let month = $state("");
	let year = $state("");
	let allSources = $state("all");
</script>

<Story name="All Components">
	{#snippet template()}
		<div class="showcase-body text-foreground min-h-screen p-6 md:p-8">
			<div class="mx-auto grid max-w-7xl gap-4 lg:grid-cols-4 md:grid-cols-2">
				<!-- ═══════════════════════════════════════════════════════════ -->
				<!-- COL 1: Payment Method -->
				<!-- ═══════════════════════════════════════════════════════════ -->
				<div class="flex flex-col gap-4">
					<Card.Root>
						<Card.Header>
							<Card.Title>Payment Method</Card.Title>
							<Card.Description>
								All transactions are secure and encrypted
							</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<!-- Name on Card -->
							<Field.Field>
								<Field.Label for="card-name">Name on Card</Field.Label>
								<Input id="card-name" placeholder="John Doe" />
							</Field.Field>

							<!-- Card Number + CVV -->
							<div class="grid grid-cols-3 gap-3">
								<Field.Field class="col-span-2">
									<Field.Label for="card-number">Card Number</Field.Label>
									<InputGroup.Root>
										<InputGroup.Input
											id="card-number"
											placeholder="1234 5678 9012 3456"
										/>
										<InputGroup.Addon align="inline-end">
											<CreditCardIcon />
										</InputGroup.Addon>
									</InputGroup.Root>
								</Field.Field>
								<Field.Field>
									<Field.Label for="card-cvv">CVV</Field.Label>
									<Input id="card-cvv" placeholder="123" />
								</Field.Field>
							</div>

							<Field.Description>
								Enter your 16-digit card number.
							</Field.Description>

							<!-- Month / Year -->
							<div class="grid grid-cols-2 gap-3">
								<Field.Field>
									<Field.Label>Month</Field.Label>
									<Select.Root type="single" bind:value={month}>
										<Select.Trigger aria-label="Select month">
											{month || "MM"}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="01">January</Select.Item>
											<Select.Item value="02">February</Select.Item>
											<Select.Item value="03">March</Select.Item>
											<Select.Item value="04">April</Select.Item>
											<Select.Item value="05">May</Select.Item>
											<Select.Item value="06">June</Select.Item>
											<Select.Item value="07">July</Select.Item>
											<Select.Item value="08">August</Select.Item>
											<Select.Item value="09">September</Select.Item>
											<Select.Item value="10">October</Select.Item>
											<Select.Item value="11">November</Select.Item>
											<Select.Item value="12">December</Select.Item>
										</Select.Content>
									</Select.Root>
								</Field.Field>
								<Field.Field>
									<Field.Label>Year</Field.Label>
									<Select.Root type="single" bind:value={year}>
										<Select.Trigger aria-label="Select year">
											{year || "YYYY"}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="2025">2025</Select.Item>
											<Select.Item value="2026">2026</Select.Item>
											<Select.Item value="2027">2027</Select.Item>
											<Select.Item value="2028">2028</Select.Item>
											<Select.Item value="2029">2029</Select.Item>
											<Select.Item value="2030">2030</Select.Item>
										</Select.Content>
									</Select.Root>
								</Field.Field>
							</div>

							<Separator />

							<!-- Billing Address -->
							<div class="space-y-2">
								<p class="text-sm font-medium">Billing Address</p>
								<p class="text-muted-foreground text-xs">
									The billing address associated with your payment method
								</p>
							</div>

							<!-- Same as Shipping -->
							<div class="flex items-center gap-2">
								<Checkbox
									id="same-shipping"
									checked={sameAsShipping}
									onCheckedChange={(v) => (sameAsShipping = v === true)}
									aria-label="Same as shipping address"
								/>
								<Label for="same-shipping" class="text-sm font-normal">
									Same as shipping address
								</Label>
							</div>

							<!-- Comments -->
							<Field.Field>
								<Field.Label for="comments">Comments</Field.Label>
								<Textarea
									id="comments"
									placeholder="Add any additional comments"
									rows={3}
								/>
							</Field.Field>
						</Card.Content>
						<Card.Footer class="flex justify-between">
							<Button>Submit</Button>
							<Button variant="outline">Cancel</Button>
						</Card.Footer>
					</Card.Root>
				</div>

				<!-- ═══════════════════════════════════════════════════════════ -->
				<!-- COL 2: Team + Sliders + Inputs -->
				<!-- ═══════════════════════════════════════════════════════════ -->
				<div class="flex flex-col gap-4">
					<!-- Team Members -->
					<Card.Root>
						<Card.Header class="items-center">
							<Avatar.Group>
								<Avatar.Root>
									<Avatar.Image
										src="https://avatar.vercel.sh/user1"
										alt="User 1"
									/>
									<Avatar.Fallback>U1</Avatar.Fallback>
								</Avatar.Root>
								<Avatar.Root>
									<Avatar.Image
										src="https://avatar.vercel.sh/user2"
										alt="User 2"
									/>
									<Avatar.Fallback>U2</Avatar.Fallback>
								</Avatar.Root>
								<Avatar.GroupCount aria-label="3 more members"
									>+3</Avatar.GroupCount
								>
							</Avatar.Group>
							<Card.Title class="text-center">No Team Members</Card.Title>
							<Card.Description class="text-center">
								Invite your team to collaborate on this project.
							</Card.Description>
						</Card.Header>
						<Card.Footer class="justify-center">
							<Button variant="outline" size="sm">
								<UserPlusIcon class="size-4" />
								Invite Members
							</Button>
						</Card.Footer>
					</Card.Root>

					<!-- Price Range -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">Price Range</Card.Title>
							<Card.Description>
								Set your budget range (${priceRange[0]} - {priceRange[1]}).
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<Slider
								type="multiple"
								bind:value={priceRange}
								min={0}
								max={800}
								step={10}
								thumbAriaLabel={(i) =>
									i === 0 ? "Minimum price" : "Maximum price"}
							/>
						</Card.Content>
					</Card.Root>

					<!-- Search Input -->
					<InputGroup.Root>
						<InputGroup.Addon>
							<SearchIcon />
						</InputGroup.Addon>
						<InputGroup.Input placeholder="Search..." />
						<InputGroup.Addon align="inline-end">
							<span class="text-muted-foreground text-xs">12 results</span>
						</InputGroup.Addon>
					</InputGroup.Root>

					<!-- URL Input -->
					<InputGroup.Root>
						<InputGroup.Addon>
							<InputGroup.Text>https://</InputGroup.Text>
						</InputGroup.Addon>
						<InputGroup.Input placeholder="example.com" />
						<InputGroup.Addon align="inline-end">
							<InfoIcon />
						</InputGroup.Addon>
					</InputGroup.Root>

					<!-- Chat Input -->
					<InputGroup.Root>
						<InputGroup.Addon>
							<PaperclipIcon />
						</InputGroup.Addon>
						<InputGroup.Input placeholder="Ask, Search or Chat..." />
						<InputGroup.Addon align="inline-end">
							<span class="text-muted-foreground text-xs">Auto</span>
						</InputGroup.Addon>
						<InputGroup.Button aria-label="Send message">
							<ArrowUpIcon />
						</InputGroup.Button>
					</InputGroup.Root>

					<!-- Verified badge -->
					<InputGroup.Root>
						<InputGroup.Addon>
							<CheckIcon class="text-green-500" />
						</InputGroup.Addon>
						<InputGroup.Addon>
							<InputGroup.Text>@shadcn</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>

				<!-- ═══════════════════════════════════════════════════════════ -->
				<!-- COL 3: Auth + Compute + GPU Counter — wrapped in .theme-section -->
				<!-- ═══════════════════════════════════════════════════════════ -->
				<section class="theme-section flex flex-col gap-4">
					<!-- Two-factor Authentication -->
					<Card.Root>
						<Card.Header>
							<div class="flex items-center justify-between">
								<Card.Title class="text-sm">
									Two-factor authentication
								</Card.Title>
								<Button size="sm">Enable</Button>
							</div>
						</Card.Header>
					</Card.Root>

					<!-- Profile Verified -->
					<Alert.Root>
						<CheckIcon class="size-4" />
						<Alert.Title>Your profile has been verified.</Alert.Title>
						<Alert.Action>
							<ChevronRightIcon class="size-4" />
						</Alert.Action>
					</Alert.Root>

					<!-- Appearance Settings -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">Appearance Settings</Card.Title>
						</Card.Header>
						<Card.Content>
							<ToggleGroup.Root
								type="single"
								value="dark"
								aria-label="Theme selection"
							>
								<ToggleGroup.Item value="light" aria-label="Light theme">
									<SunIcon class="size-4" />
								</ToggleGroup.Item>
								<ToggleGroup.Item value="dark" aria-label="Dark theme">
									<MoonIcon class="size-4" />
								</ToggleGroup.Item>
								<ToggleGroup.Item value="system" aria-label="System theme">
									<MonitorIcon class="size-4" />
								</ToggleGroup.Item>
							</ToggleGroup.Root>
						</Card.Content>
					</Card.Root>

					<!-- Compute Environment -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">Compute Environment</Card.Title>
							<Card.Description>
								Select the compute environment for your cluster.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<RadioGroup.Root
								bind:value={computeEnv}
								aria-label="Compute environment"
								class="gap-3"
							>
								<label
									class="border-input has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-lg border p-3"
								>
									<RadioGroup.Item value="kubernetes" class="mt-0.5" />
									<div>
										<p class="text-sm font-medium">Kubernetes</p>
										<p class="text-muted-foreground text-xs">
											Run GPU workloads on a K8s configured cluster. This is the
											default.
										</p>
									</div>
								</label>
								<label
									class="border-input has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-lg border p-3"
								>
									<RadioGroup.Item value="vm" class="mt-0.5" />
									<div>
										<p class="text-sm font-medium">Virtual Machine</p>
										<p class="text-muted-foreground text-xs">
											Access a VM configured cluster to run workloads. (Coming
											soon)
										</p>
									</div>
								</label>
							</RadioGroup.Root>
						</Card.Content>
					</Card.Root>

					<!-- Number of GPUs -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">Number of GPUs</Card.Title>
							<Card.Description>You can add more later.</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center justify-center gap-4">
								<Button
									variant="outline"
									size="icon"
									aria-label="Decrease GPU count"
									disabled={gpuCount <= 1}
									onclick={() => gpuCount--}
								>
									<MinusIcon class="size-4" />
								</Button>
								<span
									class="w-12 text-center text-2xl font-semibold tabular-nums"
								>
									{gpuCount}
								</span>
								<Button
									variant="outline"
									size="icon"
									aria-label="Increase GPU count"
									onclick={() => gpuCount++}
								>
									<PlusIcon class="size-4" />
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				</section>

				<!-- ═══════════════════════════════════════════════════════════ -->
				<!-- COL 4: Survey + Processing + Settings -->
				<!-- ═══════════════════════════════════════════════════════════ -->
				<div class="flex flex-col gap-4">
					<!-- Tabs: Sources -->
					<Card.Root>
						<Card.Header>
							<Tabs.Root value={allSources} onValueChange={(v) => (allSources = v)}>
								<Tabs.List>
									<Tabs.Trigger value="all">All Sources</Tabs.Trigger>
									<Tabs.Trigger value="direct">Direct</Tabs.Trigger>
									<Tabs.Trigger value="referral-tab">Referral</Tabs.Trigger>
									<Tabs.Trigger value="organic">Organic</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="all" class="pt-4">
									<div class="space-y-3">
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Total visitors</span>
											<span class="font-medium">12,486</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Conversion rate</span>
											<span class="font-medium">3.2%</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Avg. session</span>
											<span class="font-medium">4m 32s</span>
										</div>
									</div>
								</Tabs.Content>
								<Tabs.Content value="direct" class="pt-4">
									<div class="space-y-3">
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Direct visitors</span>
											<span class="font-medium">4,209</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Conversion rate</span>
											<span class="font-medium">4.1%</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Avg. session</span>
											<span class="font-medium">5m 12s</span>
										</div>
									</div>
								</Tabs.Content>
								<Tabs.Content value="referral-tab" class="pt-4">
									<div class="space-y-3">
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Referral visitors</span>
											<span class="font-medium">3,841</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Conversion rate</span>
											<span class="font-medium">2.8%</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Top referrer</span>
											<span class="font-medium">GitHub</span>
										</div>
									</div>
								</Tabs.Content>
								<Tabs.Content value="organic" class="pt-4">
									<div class="space-y-3">
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Organic visitors</span>
											<span class="font-medium">4,436</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Conversion rate</span>
											<span class="font-medium">2.6%</span>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-muted-foreground">Top keyword</span>
											<span class="font-medium">svelte ui</span>
										</div>
									</div>
								</Tabs.Content>
							</Tabs.Root>
						</Card.Header>
					</Card.Root>

					<!-- How did you hear about us -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">
								How did you hear about us?
							</Card.Title>
							<Card.Description>
								Select the option that best describes how you found us.
							</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div class="flex items-center gap-2">
								<Checkbox
									id="social"
									checked={socialMedia}
									onCheckedChange={(v) => (socialMedia = v === true)}
									aria-label="Social Media"
								/>
								<Label for="social" class="text-sm font-normal">
									Social Media
								</Label>
							</div>
							<div class="flex items-center gap-2">
								<Checkbox
									id="search"
									checked={searchEngine}
									onCheckedChange={(v) => (searchEngine = v === true)}
									aria-label="Search Engine"
								/>
								<Label for="search" class="text-sm font-normal">
									Search Engine
								</Label>
							</div>
							<div class="flex items-center gap-2">
								<Checkbox
									id="referral"
									checked={referral}
									onCheckedChange={(v) => (referral = v === true)}
									aria-label="Referral"
								/>
								<Label for="referral" class="text-sm font-normal">
									Referral
								</Label>
							</div>
							<div class="flex items-center gap-2">
								<Checkbox
									id="other"
									checked={other}
									onCheckedChange={(v) => (other = v === true)}
									aria-label="Other"
								/>
								<Label for="other" class="text-sm font-normal">Other</Label>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Processing Request -->
					<Card.Root>
						<Card.Header class="items-center text-center">
							<Spinner class="size-8" />
							<Card.Title class="text-sm">Processing your request</Card.Title>
							<Card.Description>
								Please wait while we process your request. Do not refresh the
								page.
							</Card.Description>
						</Card.Header>
						<Card.Footer class="justify-center">
							<Button variant="outline" size="sm">Cancel</Button>
						</Card.Footer>
					</Card.Root>

					<!-- Wallpaper Tinting -->
					<Card.Root>
						<Card.Content class="flex items-center justify-between py-4">
							<div>
								<p class="text-sm font-medium">Wallpaper Tinting</p>
								<p class="text-muted-foreground text-xs">
									Allow the wallpaper to be tinted.
								</p>
							</div>
							<Switch
								checked={wallpaperTinting}
								onCheckedChange={(v) => (wallpaperTinting = v)}
								aria-label="Toggle wallpaper tinting"
							/>
						</Card.Content>
					</Card.Root>

					<!-- Progress -->
					<Card.Root>
						<Card.Content class="space-y-3 py-4">
							<div class="flex justify-between text-sm">
								<span class="font-medium">Upload Progress</span>
								<span class="text-muted-foreground">{progressValue}%</span>
							</div>
							<Progress value={progressValue} aria-label="Upload progress" />
						</Card.Content>
					</Card.Root>
				</div>

				<!-- ═══════════════════════════════════════════════════════════ -->
				<!-- FULL-WIDTH ROW: Additional components -->
				<!-- ═══════════════════════════════════════════════════════════ -->

				<!-- Accordion -->
				<div class="lg:col-span-2">
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">
								Frequently Asked Questions
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<Accordion.Root type="single" value="item-1">
								<Accordion.Item value="item-1">
									<Accordion.Trigger>
										How do I reset my password?
									</Accordion.Trigger>
									<Accordion.Content>
										Click on 'Forgot Password' on the login page, enter your
										email address, and we'll send you a link to reset your
										password. The link will expire in 24 hours.
									</Accordion.Content>
								</Accordion.Item>
								<Accordion.Item value="item-2">
									<Accordion.Trigger>
										Can I change my subscription plan?
									</Accordion.Trigger>
									<Accordion.Content>
										Yes, you can upgrade or downgrade your plan at any time from
										your account settings. Changes will be reflected in your
										next billing cycle.
									</Accordion.Content>
								</Accordion.Item>
								<Accordion.Item value="item-3">
									<Accordion.Trigger>
										What payment methods do you accept?
									</Accordion.Trigger>
									<Accordion.Content>
										We accept all major credit cards, PayPal, and bank
										transfers. All payments are processed securely through our
										payment partners.
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Badges + Buttons + Skeleton -->
				<div class="lg:col-span-2 flex flex-col gap-4">
					<!-- Badges -->
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">Badges</Card.Title>
						</Card.Header>
						<Card.Content class="flex flex-wrap gap-2">
							<Badge>Default</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="outline">Outline</Badge>
							<Badge variant="destructive">Destructive</Badge>
						</Card.Content>
					</Card.Root>

					<!-- Text Formatting Toggle -->
					<Card.Root>
						<Card.Content class="flex items-center gap-4 py-4">
							<ToggleGroup.Root type="multiple" aria-label="Text formatting">
								<ToggleGroup.Item value="bold" aria-label="Bold">
									<BoldIcon class="size-4" />
								</ToggleGroup.Item>
								<ToggleGroup.Item value="italic" aria-label="Italic">
									<ItalicIcon class="size-4" />
								</ToggleGroup.Item>
								<ToggleGroup.Item value="underline" aria-label="Underline">
									<UnderlineIcon class="size-4" />
								</ToggleGroup.Item>
							</ToggleGroup.Root>

							<Separator orientation="vertical" class="h-6" />

							<!-- Buttons showcase -->
							<div class="flex flex-wrap gap-2">
								<Button size="sm">Primary</Button>
								<Button size="sm" variant="secondary">Secondary</Button>
								<Button size="sm" variant="outline">Outline</Button>
								<Button size="sm" variant="ghost">Ghost</Button>
								<Button size="sm" variant="destructive">Delete</Button>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Skeleton loading -->
					<Card.Root>
						<Card.Content class="flex items-center gap-4 py-4">
							<Skeleton class="size-10 rounded-full" />
							<div class="flex-1 space-y-2">
								<Skeleton class="h-4 w-3/4" />
								<Skeleton class="h-4 w-1/2" />
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Theme tokens demo (Alphamix extras) -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Theme tokens</Card.Title>
							<Card.Description>
								Alphamix-specific tokens beyond shadcn. Bare on the default theme.
							</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="space-y-1">
								<div class="text-muted-foreground text-xs uppercase tracking-wide">
									Page gradient
								</div>
								<div class="swatch-gradient rounded-md" style="height:2.5rem"></div>
								<div class="text-muted-foreground flex justify-between font-mono text-[10px]">
									<span>--color-darker</span>
									<span>--color-lighter</span>
								</div>
							</div>

							<div class="space-y-1">
								<div class="text-muted-foreground text-xs uppercase tracking-wide">
									Game tokens
								</div>
								<div class="grid grid-cols-3 gap-2">
									<div class="space-y-1">
										<div class="h-10 rounded-md" style="background:var(--tile-color, var(--muted))"></div>
										<div class="text-muted-foreground text-center font-mono text-[10px]">tile</div>
									</div>
									<div class="space-y-1">
										<div class="h-10 rounded-md" style="background:var(--logo-color, var(--muted))"></div>
										<div class="text-muted-foreground text-center font-mono text-[10px]">logo</div>
									</div>
									<div class="space-y-1">
										<div class="h-10 rounded-md" style="background:var(--button-background, var(--primary))"></div>
										<div class="text-muted-foreground text-center font-mono text-[10px]">button</div>
									</div>
								</div>
							</div>

							<div class="space-y-1">
								<div class="text-muted-foreground text-xs uppercase tracking-wide">
									Logo demo
								</div>
								<div class="flex justify-center py-3">
									<span class="logo-demo" aria-label="A letter tile">A</span>
								</div>
							</div>

							<div class="space-y-1">
								<div class="text-muted-foreground text-xs uppercase tracking-wide">
									Button demo
								</div>
								<button type="button" class="button-demo w-full">Play</button>
							</div>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Pagination (full width) -->
				<div class="lg:col-span-4 md:col-span-2 flex justify-center">
					<Pagination.Root count={100} perPage={10}>
						<Pagination.Content>
							<Pagination.Item>
								<Pagination.Previous />
							</Pagination.Item>
							<Pagination.Item>
								<Pagination.Link
									page={{ type: "page", value: 1 }}
									isActive={false}
								>
									1
								</Pagination.Link>
							</Pagination.Item>
							<Pagination.Item>
								<Pagination.Link
									page={{ type: "page", value: 2 }}
									isActive={true}
								>
									2
								</Pagination.Link>
							</Pagination.Item>
							<Pagination.Item>
								<Pagination.Link
									page={{ type: "page", value: 3 }}
									isActive={false}
								>
									3
								</Pagination.Link>
							</Pagination.Item>
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
							<Pagination.Item>
								<Pagination.Next />
							</Pagination.Item>
						</Pagination.Content>
					</Pagination.Root>
				</div>
			</div>
		</div>
	{/snippet}
</Story>

<style>
	/* Body-level background: radial gradient + noise overlay — matches frontend's +layout.svelte.
	   CSS-var fallbacks keep the default (shadcn) theme rendering as a plain --background. */
	.showcase-body {
		background-color: var(--color-darker, var(--background));
		background-image:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1250' height='1250'%3E%3Cfilter id='noise1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1' numOctaves='5' stitchTiles='stitch' /%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise1)'/%3E%3C/svg%3E"),
			radial-gradient(
				circle at 50% 50%,
				var(--color-lighter, var(--background)) 0%,
				var(--color-darker, var(--background)) 100%
			);
		background-size: 1250px 1250px, cover;
		background-repeat: repeat, no-repeat;
		background-attachment: fixed;
		background-blend-mode: multiply, normal;
	}

	/* .theme-section — subtle vertical gradient panel from the Alphamix HTML mockups.
	   Used to group a stack of Cards inside a themed container. Falls back to --muted
	   on the default theme so the wrapper doesn't disappear visually. */
	.theme-section {
		border-radius: 12px;
		padding: 1rem;
		background: linear-gradient(
			to bottom,
			var(--gradient-from, var(--muted)),
			var(--gradient-to, var(--muted))
		);
	}

	.swatch-gradient {
		background: linear-gradient(
			to right,
			var(--color-darker, var(--muted)),
			var(--color-lighter, var(--muted))
		);
	}

	.logo-demo {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 0.75rem;
		font-family: var(--font-sans, inherit);
		font-size: 1.75rem;
		font-weight: 700;
		background: var(--logo-color, var(--primary));
		color: var(--logo-depth-color, var(--primary-foreground));
		border: 2px solid var(--logo-border-color, var(--border));
		box-shadow: 0 3px 0 var(--logo-depth-color, transparent);
	}

	.button-demo {
		padding: 0.6rem 1rem;
		border-radius: 0.6rem;
		font-family: var(--font-sans, inherit);
		font-weight: 700;
		font-size: 0.9rem;
		background: var(--button-background, var(--primary));
		color: var(--button-color, var(--primary-foreground));
		border: none;
		box-shadow: 0 3px 0 var(--button-depth-color, transparent);
		cursor: pointer;
	}
	.button-demo:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 var(--button-depth-color, transparent);
	}
</style>
