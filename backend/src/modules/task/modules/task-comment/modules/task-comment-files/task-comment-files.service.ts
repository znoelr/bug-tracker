import { BaseService } from "../../../../../base/base.service";
import { TaskCommentFilesDto } from "./dtos/task-comment-files.dto";
import { taskCommentFilesRepository } from "./task-comment-files.repository";

export class TaskCommentFilesService extends BaseService<TaskCommentFilesDto> {}

export const taskCommentFilesService = new TaskCommentFilesService(taskCommentFilesRepository);
