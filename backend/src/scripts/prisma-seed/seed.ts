import { prismaClient } from "../../repository/prisma/prisma.client";

async function main() {
  
}

main()
  .then(async () => await prismaClient.$disconnect())
  .catch(async () => await prismaClient.$disconnect());
