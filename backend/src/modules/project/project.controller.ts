import { BaseController } from "../base/base.controller";
import { ProjectDto } from "./dtos/project.dto";
import { projectService } from "./project.service";

class ProjectController extends BaseController<ProjectDto> {}

export default new ProjectController(ProjectDto, projectService);
