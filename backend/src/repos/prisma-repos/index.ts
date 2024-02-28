import { BaseRepo } from "../../modules/base/base.repo";
import { TaskRepo } from "./task.repo";

// TODO: Update generic type, replace '{}' with the actual TaskModel from Prisma
class PrismaModels {
  public TaskRepo: BaseRepo<{}> = new TaskRepo({});
}

export default new PrismaModels();
