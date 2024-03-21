import { prismaClient } from './prisma.client';

export async function connect() {
  await prismaClient.$connect();
}

export async function disconnect() {
  await prismaClient.$disconnect()
    .catch(async () => await prismaClient.$disconnect());
}
