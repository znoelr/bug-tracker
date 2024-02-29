import { BaseService } from '../base/base.service';
import { TaskDto } from './dtos/task.dto';
import { taskRepository } from './task.repository';

export class TaskService extends BaseService<TaskDto> {}

export default new TaskService(taskRepository);
