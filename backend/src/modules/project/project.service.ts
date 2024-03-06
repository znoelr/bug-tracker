import { BaseService } from '../base/base.service';
import { ProjectDto } from './dtos/project.dto';
import { projectRepository } from './project.repository';

export class ProjectService extends BaseService<ProjectDto> {}

export const projectService = new ProjectService(projectRepository);
