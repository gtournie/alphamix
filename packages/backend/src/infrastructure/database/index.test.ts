import testPrisma, { USER_NAME_MAX_LENGTH } from './index';
import { afterAll, beforeEach, describe, it, expect } from 'vitest';

afterAll(async () => {
  // Disconnect the test database
  await testPrisma.$disconnect();
});

beforeEach(async () => {
  // Clear the User table before each test
  await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`);
});

function randomEmail() {
  return Math.random().toString(36).substring(2, 15) + '@example.com';
}

function createOneUser(name: string) {
  return testPrisma.user.create({ data: { name, email: randomEmail() } });
}

// use a generator to createMany users
async function* createManyUsers(total: number) {
  const chunk = 2000;
  const totalChunks = Math.ceil(total / chunk);
  for (let i = 0; i < totalChunks; ++i) {
    await testPrisma.user.createMany({
      data: Array.from({ length: chunk }, (_, j) => {
        return {
          name: `User${i * chunk + j}`,
          email: randomEmail(),
        };
      })
    });
    yield [i * chunk, i * chunk + chunk];
  }
}

describe('getUniqueUserName', () => {
  it('should return the same name if it is unique', async () => {
    const name = 'UniqueName';
    let uniqueName = await testPrisma.user.getUniqueUserName(name);
    expect(uniqueName).toBe(name);

    await createOneUser('User1');
    await createOneUser('User2');
    uniqueName = await testPrisma.user.getUniqueUserName("User");
    expect(uniqueName).toBe("User");

    uniqueName = await testPrisma.user.getUniqueUserName("User54");
    expect(uniqueName).toBe("User54");
  });

  it('should be case insensitive', async () => {
    await createOneUser('user');
    await createOneUser('User2');
    await createOneUser('plaYer3');
    const uniqueName = await testPrisma.user.getUniqueUserName("PLAYER");
    expect(uniqueName).toBe("PLAYER4");
  });

  it('should append a number if the name already exists', async () => {
    // Inject other name with numeric suffix to ensure there's no conflict
    await createOneUser('UniqueName1');
    await createOneUser('UniqueName2');
    await createOneUser('UniqueName3');
    await createOneUser('UniqueName4');

    await createOneUser('DuplicateName');

    let uniqueName = await testPrisma.user.getUniqueUserName('DuplicateName');
    expect(uniqueName).toBe('DuplicateName2');

    await createOneUser('DuplicateName2');
    uniqueName = await testPrisma.user.getUniqueUserName('DuplicateName');
    expect(uniqueName).toBe('DuplicateName3');
  });

  it('should handle names with numeric suffixes', async () => {
    await createOneUser('User');
    let uniqueName = await testPrisma.user.getUniqueUserName('User');
    expect(uniqueName).toBe('User2');

    await createOneUser('User2');
    uniqueName = await testPrisma.user.getUniqueUserName('User');
    expect(uniqueName).toBe('User3');

    uniqueName = await testPrisma.user.getUniqueUserName('User0');
    expect(uniqueName).toBe('User0');

    await createOneUser('User0');
    uniqueName = await testPrisma.user.getUniqueUserName('User');
    expect(uniqueName).toBe('User3');

    uniqueName = await testPrisma.user.getUniqueUserName('User1');
    expect(uniqueName).toBe('User1');

    await createOneUser('User1');
    uniqueName = await testPrisma.user.getUniqueUserName('User');
    expect(uniqueName).toBe('User3');
    uniqueName = await testPrisma.user.getUniqueUserName('User0');
    expect(uniqueName).toBe('User3');
  });

  it('should truncate names exceeding the maximum length', async () => {
    const longName = 'A'.repeat(20); // Assuming max length is 15
    const uniqueName = await testPrisma.user.getUniqueUserName(longName);
    expect(uniqueName?.length).toBeLessThanOrEqual(USER_NAME_MAX_LENGTH);

    await createOneUser(longName.slice(0, USER_NAME_MAX_LENGTH));
    let newUniqueName = await testPrisma.user.getUniqueUserName(longName);
    expect(newUniqueName?.length).toBeLessThanOrEqual(USER_NAME_MAX_LENGTH);
    expect(newUniqueName).toBe(longName.slice(0, USER_NAME_MAX_LENGTH - 1));

    await createOneUser(longName.slice(0, USER_NAME_MAX_LENGTH - 1));
    newUniqueName = await testPrisma.user.getUniqueUserName(longName);
    expect(newUniqueName?.length).toBeLessThanOrEqual(USER_NAME_MAX_LENGTH);
    expect(newUniqueName).toBe(longName.slice(0, USER_NAME_MAX_LENGTH - 1) + '2');

    await Promise.all(Array.from({ length: 8 }, (_, i) => i + 2).map(async (i) => {
      return await createOneUser(longName.slice(0, USER_NAME_MAX_LENGTH - 1) + i);
    }));
    newUniqueName = await testPrisma.user.getUniqueUserName(longName);
    expect(newUniqueName).toBe(longName.slice(0, USER_NAME_MAX_LENGTH - 2));
  });

  it('should not take too much time to find a unique name', async () => {
    const total = 10000;
    await testPrisma.user.createMany({
      data: Array.from({ length: total }, (_, i) => {
        return {
          name: `User${i + 2}`,
          email: randomEmail(),
        };
      })
    });
    console.log("Created users");
    await createOneUser('User')

    let startTime = Date.now();
    let uniqueName = await testPrisma.user.getUniqueUserName('User');
    let endTime = Date.now();
    
    let duration = endTime - startTime;
    console.log(`Time taken to find unique name: ${duration}ms`);
    expect(duration).toBeLessThan(200); // Adjust the threshold as needed
    expect(uniqueName).toBe('User' + (total + 2));

    startTime = Date.now();
    await testPrisma.user.getUniqueUserName('Playe');
    endTime = Date.now();

    duration = endTime - startTime;
    console.log(`Time taken to find unique name: ${duration}ms`);
    expect(duration).toBeLessThan(100);
  });
});
