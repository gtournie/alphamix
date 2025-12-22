<script lang="ts">
	import config from '$lib/config';
	import Player from '$lib/components/Player.svelte';
	import { goto } from '$app/navigation';
	import api from '$lib/api';

	let friends = $state([]);

	$effect(() => {
		(async () => {
			const result = await api.getFriends();
			friends = result;
		})();
	});

	async function createGame(userIds) {
		const { id } = await api.createGame(userIds);
		// TODO: check if id is not 0 | null
		goto(`/game?id=${id}`);
	}
</script>

{#each friends as friend}
	<Player name={friend.name}>
		<div on:click={() => createGame([friend.id])}>Jouer</div>
	</Player>
{/each}
