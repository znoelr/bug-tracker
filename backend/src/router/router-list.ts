import { fileRouteConfig } from "../modules/file/file.router";
import { projectRouteConfig } from "../modules/project/project.router";
import { roleRouteConfig } from "../modules/role/role.router";
import { taskRouteConfig } from "../modules/task/task.router";
import { userRouteConfig } from "../modules/user/user.router";

export default [
  taskRouteConfig,
  userRouteConfig,
  roleRouteConfig,
  projectRouteConfig,
  fileRouteConfig,
];
