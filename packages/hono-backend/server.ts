
import app from './src/index';

// Tu peux utiliser une variable d’environnement ou un port par défaut
const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 Server running at http://0.0.0.0:${port}`);

Bun.serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});



// setTimeout(async () => {
//   const response = await fetch(`http://localhost:${port}/api/games/test/9`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ entry: 'Guillaume', toto: /./ }),
//   })

//   const data = await response.json()
//   console.log('✅ Réponse de la route POST:', data)
// }, 500)

