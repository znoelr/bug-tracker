import taskService from "./task.service";
import { BaseController } from "../base/base.controller";
import { TaskDto } from "./dtos/task.dto";

class TaskController extends BaseController<TaskDto> {}

export default new TaskController(TaskDto, taskService);
