import { PrismaBaseRepository } from "../../repository/prisma/prisma.base.repository";
import { prismaClient } from "../../repository/prisma/prisma.client";
import { ProjectDto } from "./dtos/project.dto";

export class ProjectRepository extends PrismaBaseRepository<ProjectDto> {
  constructor() {
    super(prismaClient.project);
  }
}

export const projectRepository = new ProjectRepository();
