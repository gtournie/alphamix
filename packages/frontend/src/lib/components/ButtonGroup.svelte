<script lang="ts">
	const {
		children,
	} = $props();
</script>

<div class="button-group">
  {@render children()}
</div>

<style>
  .button-group {
    display: flex;
    gap: 0;
    text-align: center;
    /* --left-shadow: 0; */
  }

  .button-group > :global(:not(:first-child)) {
    --border-top-left-radius: 0;
    --border-bottom-left-radius: 0;
    --clip-path: inset(-10px -10px -10px 0);
  }
  .button-group > :global(:not(:last-child)){
    --border-top-right-radius: 0;
    --border-bottom-right-radius: 0;
  }
</style>