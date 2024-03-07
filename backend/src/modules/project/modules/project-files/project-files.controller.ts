import { BaseController } from "../../../base/base.controller";
import { ProjectFilesDto } from "./dtos/project-files.dto";
import { projectFilesService } from "./project-files.service";

class ProjectFilesController extends BaseController<ProjectFilesDto> {}

export default new ProjectFilesController(ProjectFilesDto, projectFilesService);
