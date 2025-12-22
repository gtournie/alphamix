<script lang="ts">
  // Ajoutez ici la logique spécifique au jeu
</script>

<div class="game-layout">
  <header class="game-header">
    <h1 class="text-2xl font-bold">Scrabble Game</h1>
  </header>
  <main class="game-content">
    <!-- Contenu du jeu -->
    <p>Bienvenue dans le jeu !</p>
  </main>
  <footer class="game-footer">
    <!-- Pied de page du jeu -->
    <p>&copy; 2023 Scrabble Game</p>
  </footer>
</div>

<style>
  /* Styles spécifiques au layout du jeu */
  .game-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .game-header {
    background-color: #f8f9fa;
    padding: 1rem;
  }
  .game-content {
    flex: 1;
    padding: 1rem;
  }
  .game-footer {
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: center;
  }
</style>
