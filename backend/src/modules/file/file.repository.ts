import { PrismaBaseRepository } from "../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { FileDto } from "./dtos/file.dto";

export class FileRepository extends PrismaBaseRepository<FileDto> {
  public __name__: string = 'File';

  constructor() {
    super(prismaClient.file);
  }
}

export const fileRepository = new FileRepository();
