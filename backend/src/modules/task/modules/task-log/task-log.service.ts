import { BaseService } from "../../../base/base.service";
import { TaskLogDto } from "./dtos/task-log.dto";
import { taskLogRepository } from "./task-log.repository";

export class TaskLogService extends BaseService<TaskLogDto> {}

export const taskLogService = new TaskLogService(taskLogRepository);
