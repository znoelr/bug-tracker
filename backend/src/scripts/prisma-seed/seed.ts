import { prismaClient } from "../../repository/prisma/prisma.client";
import { run as runPermissions } from './permission.seed';
import { run as runRoles } from './role.seed';
import { run as runRolePermissions } from './role-permissions.seed';
import { run as runUsers } from './user.seed';
import { run as runUserRoles } from './user-roles.seed';
import { run as runProjects } from './project.seed';
import { run as runTasks } from './task.seed';
import { run as runTaskLogs } from './task-logs.seed';
import { run as runTaskComments } from './task-comments.seed';
import { run as runFiles } from './file.seed';
import { run as runTaskFiles } from './task-files.seed';
import { run as runTaskCommentFiles } from './task-comment-files.seed';
import { run as runProjectFiles } from './project-files.seed';

async function main() {
  const permissions = await runPermissions();
  const roles = await runRoles();
  await runRolePermissions(roles, permissions);
  const users = await runUsers();
  await runUserRoles(users, roles);
  const projects = await runProjects(users);
  const tasks = await runTasks(users, projects);
  await runTaskLogs(users, tasks);
  const taskComments = await runTaskComments(users, tasks);
  const files = await runFiles();
  await runTaskFiles(tasks, files.slice(0, 13));
  await runTaskCommentFiles(taskComments, files.slice(13, 45));
  await runProjectFiles(projects, files.slice(45));
}

main()
  .then(async () => await prismaClient.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prismaClient.$disconnect();
  });
