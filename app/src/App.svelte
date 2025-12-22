<script lang="ts">
  import { onMount } from 'svelte';
  import Login from './pages/Login.svelte';
  import Game from './pages/Game.svelte';

  let isAuthenticated = false;

  onMount(async () => {
    try {
      const response = await fetch('/api/auth/check', { credentials: 'include' });
      isAuthenticated = response.ok;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification :', error);
    }
  });
</script>

<main>
  {#if isAuthenticated}
    <Game />
  {:else}
    <Login />
  {/if}
</main>

<style>
  /* Les styles spécifiques au composant seront ajoutés ici */
</style>
