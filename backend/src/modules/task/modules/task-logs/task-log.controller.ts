import { BaseController } from "../../../base/base.controller";
import { TaskLogDto } from "./dtos/task-log.dto";
import { taskLogService } from "./task-log.service";

class TaskLogController extends BaseController<TaskLogDto> {}

export default new TaskLogController(TaskLogDto, taskLogService);
