import testPrisma, { USER_NAME_MAX_LENGTH } from './index';
import { afterAll, beforeEach, describe, it, expect } from 'vitest';

afterAll(async () => {
  // Disconnect the test database
  await testPrisma.$disconnect();
});

beforeEach(async () => {
  // Clear the Player table before each test
  await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE "Player" RESTART IDENTITY CASCADE;`);
});

function randomEmail() {
  return Math.random().toString(36).substring(2, 15) + '@example.com';
}

function createOnePlayer(name: string) {
  return testPrisma.player.create({ data: { name, email: randomEmail() } });
}

// use a generator to createMany players
async function* createManyPlayers(total: number) {
  const chunk = 2000;
  const totalChunks = Math.ceil(total / chunk);
  for (let i = 0; i < totalChunks; ++i) {
    await testPrisma.player.createMany({
      data: Array.from({ length: chunk }, (_, j) => {
        return {
          name: `Player${i * chunk + j}`,
          email: randomEmail(),
        };
      })
    });
    yield [i * chunk, i * chunk + chunk];
  }
}

describe('getUniquePlayerName', () => {
  it('should return the same name if it is unique', async () => {
    const name = 'UniqueName';
    let uniqueName = await testPrisma.player.getUniquePlayerName(name);
    expect(uniqueName).toBe(name);

    await createOnePlayer('Player1');
    await createOnePlayer('Player2');
    uniqueName = await testPrisma.player.getUniquePlayerName("Player");
    expect(uniqueName).toBe("Player");

    uniqueName = await testPrisma.player.getUniquePlayerName("Player54");
    expect(uniqueName).toBe("Player54");
  });

  it('should be case insensitive', async () => {
    await createOnePlayer('player');
    await createOnePlayer('Player2');
    await createOnePlayer('plaYer3');
    const uniqueName = await testPrisma.player.getUniquePlayerName("PLAYER");
    expect(uniqueName).toBe("PLAYER4");
  });

  it('should append a number if the name already exists', async () => {
    // Inject other name with numeric suffix to ensure there's no conflict
    await createOnePlayer('UniqueName1');
    await createOnePlayer('UniqueName2');
    await createOnePlayer('UniqueName3');
    await createOnePlayer('UniqueName4');

    await createOnePlayer('DuplicateName');

    let uniqueName = await testPrisma.player.getUniquePlayerName('DuplicateName');
    expect(uniqueName).toBe('DuplicateName2');

    await createOnePlayer('DuplicateName2');
    uniqueName = await testPrisma.player.getUniquePlayerName('DuplicateName');
    expect(uniqueName).toBe('DuplicateName3');
  });

  it('should handle names with numeric suffixes', async () => {
    await createOnePlayer('Player');
    let uniqueName = await testPrisma.player.getUniquePlayerName('Player');
    expect(uniqueName).toBe('Player2');

    await createOnePlayer('Player2');
    uniqueName = await testPrisma.player.getUniquePlayerName('Player');
    expect(uniqueName).toBe('Player3');

    uniqueName = await testPrisma.player.getUniquePlayerName('Player0');
    expect(uniqueName).toBe('Player0');

    await createOnePlayer('Player0');
    uniqueName = await testPrisma.player.getUniquePlayerName('Player');
    expect(uniqueName).toBe('Player3');

    uniqueName = await testPrisma.player.getUniquePlayerName('Player1');
    expect(uniqueName).toBe('Player1');

    await createOnePlayer('Player1');
    uniqueName = await testPrisma.player.getUniquePlayerName('Player');
    expect(uniqueName).toBe('Player3');
    uniqueName = await testPrisma.player.getUniquePlayerName('Player0');
    expect(uniqueName).toBe('Player3');
  });

  it('should truncate names exceeding the maximum length', async () => {
    const longName = 'A'.repeat(20); // Assuming max length is 15
    const uniqueName = await testPrisma.player.getUniquePlayerName(longName);
    expect(uniqueName?.length).toBeLessThanOrEqual(USER_NAME_MAX_LENGTH);

    await createOnePlayer(longName.slice(0, USER_NAME_MAX_LENGTH));
    let newUniqueName = await testPrisma.player.getUniquePlayerName(longName);
    expect(newUniqueName?.length).toBeLessThanOrEqual(USER_NAME_MAX_LENGTH);
    expect(newUniqueName).toBe(longName.slice(0, USER_NAME_MAX_LENGTH - 1));

    await createOnePlayer(longName.slice(0, USER_NAME_MAX_LENGTH - 1));
    newUniqueName = await testPrisma.player.getUniquePlayerName(longName);
    expect(newUniqueName?.length).toBeLessThanOrEqual(USER_NAME_MAX_LENGTH);
    expect(newUniqueName).toBe(longName.slice(0, USER_NAME_MAX_LENGTH - 1) + '2');

    await Promise.all(Array.from({ length: 8 }, (_, i) => i + 2).map(async (i) => {
      return await createOnePlayer(longName.slice(0, USER_NAME_MAX_LENGTH - 1) + i);
    }));
    newUniqueName = await testPrisma.player.getUniquePlayerName(longName);
    expect(newUniqueName).toBe(longName.slice(0, USER_NAME_MAX_LENGTH - 2));
  });

  it('should not take too much time to find a unique name', async () => {
    const total = 10000;
    await testPrisma.player.createMany({
      data: Array.from({ length: total }, (_, i) => {
        return {
          name: `Player${i + 2}`,
          email: randomEmail(),
        };
      })
    });
    console.log("Created players");
    await createOnePlayer('Player')

    let startTime = Date.now();
    let uniqueName = await testPrisma.player.getUniquePlayerName('Player');
    let endTime = Date.now();
    
    let duration = endTime - startTime;
    console.log(`Time taken to find unique name: ${duration}ms`);
    expect(duration).toBeLessThan(200); // Adjust the threshold as needed
    expect(uniqueName).toBe('Player' + (total + 2));

    startTime = Date.now();
    await testPrisma.player.getUniquePlayerName('Playe');
    endTime = Date.now();

    duration = endTime - startTime;
    console.log(`Time taken to find unique name: ${duration}ms`);
    expect(duration).toBeLessThan(100);
  });
});
