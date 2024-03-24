import { clear as clearDB, seed as seedDB } from './src/scripts/prisma-seed/seed';

beforeAll(async () => {
  await clearDB();
  global.records = await seedDB();
});

afterAll(() => {
  console.log('TODO: Clear DB');
});
