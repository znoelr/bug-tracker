import { BaseService } from "../../../base/base.service";
import { TaskCommentDto } from "./dtos/task-comment.dto";
import { taskCommentRepository } from "./task-comment.repository";

export class TaskCommentService extends BaseService<TaskCommentDto> {}

export const taskCommentService = new TaskCommentService(taskCommentRepository);
