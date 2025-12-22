<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/user';

	// import { getContext } from 'svelte';

	// const userCtxt = getContext('user')
	// let user = $state($userCtxt);
	// userCtxt.subscribe(value => (user = value));
</script>

<p>Welcome {$user?.name}</p>
