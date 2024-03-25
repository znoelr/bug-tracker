import { prismaClient } from "../../infrastructure/prisma/prisma.client";

/** Primary tables */
export const fetchPermissions: () => any = async () => await prismaClient.permission.findMany();
export const fetchPermission: any = async (where: any) => await prismaClient.permission.findUnique({ where });

export const fetchRoles: () => any = async () => await prismaClient.role.findMany();
export const fetchRole: any = async (where: any) => await prismaClient.role.findUnique({ where });

export const fetchUsers: () => any = async () => await prismaClient.user.findMany();
export const fetchUser: any = async (where: any) => await prismaClient.user.findUnique({ where });

export const fetchProjects: () => any = async () => await prismaClient.project.findMany();
export const fetchProject: any = async (where: any) => await prismaClient.project.findUnique({ where });

export const fetchTasks: () => any = async () => await prismaClient.task.findMany();
export const fetchTask: any = async (where: any) => await prismaClient.task.findUnique({ where });

export const fetchTaskComments: () => any = async () => await prismaClient.taskComment.findMany();
export const fetchTaskComment: any = async (where: any) => await prismaClient.taskComment.findUnique({ where });

export const fetchTaskLogs: () => any = async () => await prismaClient.taskLog.findMany();
export const fetchTaskLog: any = async (where: any) => await prismaClient.taskLog.findUnique({ where });

export const fetchFiles: () => any = async () => await prismaClient.file.findMany();
export const fetchFile: any = async (where: any) => await prismaClient.file.findUnique({ where });

/** Intermediary tables */
export const fetchRolePermissions: () => any = async () => await prismaClient.rolePermissions.findMany();
export const fetchRolePermission: any = async (where: any) => await prismaClient.rolePermissions.findUnique({ where });

export const fetchUserRoles: () => any = async () => await prismaClient.userRoles.findMany();
export const fetchUserRole: any = async (where: any) => await prismaClient.userRoles.findUnique({ where });

export const fetchTaskCommentFiles: () => any = async () => await prismaClient.taskCommentFiles.findMany();
export const fetchTaskCommentFile: any = async (where: any) => await prismaClient.taskCommentFiles.findUnique({ where });

export const fetchTaskFiles: () => any = async () => await prismaClient.taskFiles.findMany();
export const fetchTaskFile: any = async (where: any) => await prismaClient.taskFiles.findUnique({ where });

export const fetchProjectFiles: () => any = async () => await prismaClient.projectFiles.findMany();
export const fetchProjectFile: any = async (where: any) => await prismaClient.projectFiles.findUnique({ where });
