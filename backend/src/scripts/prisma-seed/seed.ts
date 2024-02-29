import { prismaClient } from "../../repos/prisma-repos/prisma.client";

async function main() {
  
}

main()
  .then(async () => await prismaClient.$disconnect())
  .catch(async () => await prismaClient.$disconnect());
