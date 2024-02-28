import { repository } from '../../repos';
import { BaseService } from '../base/base.service';
import { TaskDto } from './dtos/task.dto';

export class TaskService extends BaseService<TaskDto> {}

export default new TaskService(repository.TaskRepo);
