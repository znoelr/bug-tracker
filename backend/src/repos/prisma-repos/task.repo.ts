import { TaskDto } from "../../modules/task/dtos/task.dto";
import { PrismaBaseRepo } from "./prisma-base.repo";

export class TaskRepo extends PrismaBaseRepo<TaskDto> {}
