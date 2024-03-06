import { BaseController } from "../../../base/base.controller";
import { TaskCommentDto } from "./dtos/task-comment.dto";
import { taskCommentService } from "./task-comment.service";

class TaskCommentController extends BaseController<TaskCommentDto> {}

export default new TaskCommentController(TaskCommentDto, taskCommentService);
