import db from "../src/infrastructure/database";
import { repositories } from '../src/infrastructure/database/repositories';

// const client = new PrismaClient();

const user = {
  id: "19a900dd-d2c5-4b85-c1c3-bdfcabe5770c",
  name: "Guillaume",
  email: "gtournie@gmail.com"
}
// await db.user.create({ data: user });

// const players = [
//   {
//     id: "ddedbc84-124b-4440-8caa-6755c507a781",
//     name: 'Robert',
//     email: "robert@scribel.com"
//   },
//   {
//     id: "b4af02b9-4139-4b83-a9f8-d0a283cc000f",
//     name: 'Alice',
//     email: "alice@scribel.com"
//   },
//   {
//     id: "5603d0c9-3ede-42b8-9c3b-2b3b9fdd9e0b",
//     name: 'John',
//     email: "john@scribel.com"
//   },
//   {
//     id: "5d589c3a-8e93-458f-9d03-e4d26d20f6c5",
//     name: 'Jane',
//     email: "jane@scribel.com"
//   },
//   {
//     id: "782e54ba-2194-483c-9e0a-52f813bed053",
//     name: 'Bob',
//     email: "bob@scribel.com"
//   },
// ];
// await db.user.createMany({ data: players });


// const friends = players.map(player => ({
//   userId: user.id,
//   friendId: player.id
// }));
// await db.userFriend.createMany({ data: friends });








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