import { BaseController } from "../../../base/base.controller";
import { TaskFilesDto } from "./dtos/task-files.dto";
import { taskFilesService } from "./task-files.service";

class TaskFilesController extends BaseController<TaskFilesDto> {}

export default new TaskFilesController(TaskFilesDto, taskFilesService);
