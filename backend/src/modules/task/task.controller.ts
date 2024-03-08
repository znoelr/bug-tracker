import { BaseController } from "../base/base.controller";
import { TaskDto } from "./dtos/task.dto";
import { taskService } from "./task.service";

class TaskController extends BaseController<TaskDto> {}

export default new TaskController(TaskDto, taskService);
