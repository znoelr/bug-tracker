import { BaseService } from "../../../base/base.service";
import { ProjectFilesDto } from "./dtos/project-files.dto";
import { projectFilesRepository } from "./project-files.repository";

export class ProjectFilesService extends BaseService<ProjectFilesDto> {}

export const projectFilesService = new ProjectFilesService(projectFilesRepository);
