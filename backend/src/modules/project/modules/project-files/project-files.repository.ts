import { PrismaBaseRepository } from "../../../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../../../repository/prisma/prisma.client";
import { ProjectFilesDto } from "./dtos/project-files.dto";

export class ProjectFilesRepository extends PrismaBaseRepository<ProjectFilesDto> {
  constructor() {
    super(prismaClient.projectFiles);
  }
}

export const projectFilesRepository = new ProjectFilesRepository();
