import { permissionRouteConfig } from "../modules/permission/permission.router";
import { roleRouteConfig } from "../modules/role/role.router";
import { userRouteConfig } from "../modules/user/user.router";
import { taskRouteConfig } from "../modules/task/task.router";
import { projectRouteConfig } from "../modules/project/project.router";
import { fileRouteConfig } from "../modules/file/file.router";

export default [
  permissionRouteConfig,
  roleRouteConfig,
  userRouteConfig,
  taskRouteConfig,
  projectRouteConfig,
  fileRouteConfig,
];
