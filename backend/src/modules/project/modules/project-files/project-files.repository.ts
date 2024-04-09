import { PrismaBaseRepository } from "../../../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../../../infrastructure/prisma/prisma.client";
import { ProjectFilesDto } from "./dtos/project-files.dto";

export class ProjectFilesRepository extends PrismaBaseRepository<ProjectFilesDto> {
  public __name__: string = 'PreojectFile';

  constructor() {
    super(prismaClient.projectFiles);
  }
}

export const projectFilesRepository = new ProjectFilesRepository();
