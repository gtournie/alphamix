// const { PrismaClient } = require('@prisma/client');

// const client = new PrismaClient();

// const players = [
//   {
//     id: 1,
//     name: 'Robert',
//     createdAt: new Date(2024, 7, 12),
//   },
//   {
//     id: 2,
//     name: 'Alice',
//     createdAt: new Date(2025, 2, 19),
//   },
//   {
//     id: 3,
//     name: 'John',
//     createdAt: new Date(2023, 11, 25),
//   },
//   {
//     id: 4,
//     name: 'Jane',
//     createdAt: new Date(2025, 1, 30),
//   },
//   {
//     id: 5,
//     name: 'Bob',
//     createdAt: new Date(2024, 8, 15),
//   },
// ];

// const games = [
//   {
//     id: 1,
//     active: true,
//     tileBag: "AAEEKLGHIPNNTRS",
//     currentPlayerId: 1,
//     history: "",
//     createdAt: new Date(2024, 7, 12),
//   },
//   {
//     id: 2,
//     active: true,
//     tileBag: "AAOYZDFEEKLGHIPNNTRS",
//     currentPlayerId: 2,
//     history: "",
//     createdAt: new Date(2025, 2, 19),
//   },
//   {
//     id: 3,
//     active: false,
//     tileBag: "XYZABC",
//     currentPlayerId: 1,
//     history: "",
//     createdAt: new Date(2024, 9, 1),
//   },
//   {
//     id: 4,
//     active: true,
//     tileBag: "LMNOPQRSTUV",
//     currentPlayerId: 4,
//     history: "",
//     createdAt: new Date(2024, 10, 5),
//   },
//   {
//     id: 5,
//     active: false,
//     tileBag: "ABCDEFGHIJKLMN",
//     currentPlayerId: 5,
//     history: "",
//     createdAt: new Date(2025, 1, 20),
//   },
// ];

// const gamePlayers = [
//   {
//     gameId: 1,
//     playerId: 1,
//     score: 100,
//     tiles: "AERTSLM",
//     updatedAt: new Date(2024, 7, 12),
//   },
//   {
//     gameId: 1,
//     playerId: 2,
//     score: 200,
//     tiles: "MYVBOEN",
//     updatedAt: new Date(2025, 2, 19),
//   },
//   {
//     gameId: 2,
//     playerId: 1,
//     score: 150,
//     tiles: "XYZABCS",
//     updatedAt: new Date(2024, 9, 1),
//   }
// ];

// async function seed(name, collection) {
//   console.log(`Creating  ${name}s...`);

//   for (const item of collection) {
//     console.log(` - Creating ${name}:`, item.name || item.id || [item.gameId, item.playerId].filter(x => x).join('-'));
//     await client[name].upsert({
//       where: name === 'gamePlayer' ? { gameId_playerId: { gameId: item.gameId, playerId: item.playerId } } : { id: item.id },
//       update: item,
//       create: item,
//     });
//   }
// }

// const collections = [['player', players], ['game', games], ['gamePlayer', gamePlayers]];
// try {
//   for (const [name, collection] of collections) {
//     await seed(name, collection)
//     console.log(`Created/Updated ${name}s successfully.`);
//   };
// } catch (error) {
//   console.error('Error:', error);
// } finally {
//   client.$disconnect();
//   console.log('Disconnected Prisma Client, exiting.');
// }