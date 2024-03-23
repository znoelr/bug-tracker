import { main as seedDB } from './src/scripts/prisma-seed/seed';

beforeAll(async () => {
  await seedDB();
});

afterAll(() => {
  console.log('TODO: Clear DB');
});
