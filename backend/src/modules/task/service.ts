import repos from '../../repos';
import { BaseService } from '../base/base.service';

export class TaskService extends BaseService<{}> {}

export default new TaskService(repos.TaskRepo);
