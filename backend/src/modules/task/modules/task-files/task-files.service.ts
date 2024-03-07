import { BaseService } from "../../../base/base.service";
import { TaskFilesDto } from "./dtos/task-files.dto";
import { taskFilesRepository } from "./task-files.repository";

export class TaskFilesService extends BaseService<TaskFilesDto> {}

export const taskFilesService = new TaskFilesService(taskFilesRepository);
