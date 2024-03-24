import { FileDto } from "../../file/dtos/file.dto";
import { PermissionDto } from "../../permission/dtos/permission.dto";
import { ProjectDto } from "../../project/dtos/project.dto";
import { RoleDto } from "../../role/dtos/role.dto";
import { TaskDto } from "../../task/dtos/task.dto";
import { TaskCommentDto } from "../../task/modules/task-comment/dtos/task-comment.dto";
import { TaskLogDto } from "../../task/modules/task-log/dtos/task-log.dto";
import { UserDto } from "../../user/dtos/user.dto";

export type DBRecords = {
  permissions: PermissionDto[];
  roles: RoleDto[];
  users: UserDto[];
  projects: ProjectDto[];
  tasks: TaskDto[];
  taskComments: TaskCommentDto[];
  taskLogs: TaskLogDto[],
  files: FileDto[];
};
