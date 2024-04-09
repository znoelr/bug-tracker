import { PrismaBaseRepository } from "../../infrastructure/prisma/prisma.base.repository";
import { prismaClient } from "../../infrastructure/prisma/prisma.client";
import { ProjectDto } from "./dtos/project.dto";

export class ProjectRepository extends PrismaBaseRepository<ProjectDto> {
  public __name__: string = 'Project';

  constructor() {
    super(prismaClient.project);
  }
}

export const projectRepository = new ProjectRepository();
