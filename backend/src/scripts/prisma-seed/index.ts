import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { main } from "./seed";

main()
  .then(async () => await prismaClient.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prismaClient.$disconnect();
  })
;
