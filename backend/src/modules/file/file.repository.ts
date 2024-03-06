import { PrismaBaseRepository } from "../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../repository/prisma/prisma.client";
import { FileDto } from "./dtos/file.dto";

export class FileRepository extends PrismaBaseRepository<FileDto> {
  constructor() {
    super(prismaClient.file);
  }
}

export const fileRepository = new FileRepository();
