import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { seed } from "./seed";

seed()
  .then(async () => await prismaClient.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prismaClient.$disconnect();
  })
;
