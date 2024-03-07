import { BaseController } from "../../../../../base/base.controller";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";
import { taskCommentFilesService } from "./task-comment-files.service";

class TaskCommentFilesController extends BaseController<TaskCommentFilesDto> {}

export default new TaskCommentFilesController(TaskCommentFilesDto, taskCommentFilesService);
