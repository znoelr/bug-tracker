import { prismaClient } from "../../infrastructure/prisma/prisma.client";

/** Primary tables */
export const fetchPermissions: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.permission.findMany({ where });
export const fetchPermission: (where: any) => Promise<any> = async (where: any) => await prismaClient.permission.findUnique({ where });

export const fetchRoles: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.role.findMany({ where });
export const fetchRole: (where: any) => Promise<any> = async (where: any) => await prismaClient.role.findUnique({ where });

export const fetchUsers: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.user.findMany({ where });
export const fetchUser: (where: any) => Promise<any> = async (where: any) => await prismaClient.user.findUnique({ where });

export const fetchProjects: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.project.findMany({ where });
export const fetchProject: (where: any) => Promise<any> = async (where: any) => await prismaClient.project.findUnique({ where });

export const fetchTasks: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.task.findMany({ where });
export const fetchTask: (where: any) => Promise<any> = async (where: any) => await prismaClient.task.findUnique({ where });

export const fetchTaskComments: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.taskComment.findMany({ where });
export const fetchTaskComment: (where: any) => Promise<any> = async (where: any) => await prismaClient.taskComment.findUnique({ where });

export const fetchLogs: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.log.findMany({ where });
export const fetchLog: (where: any) => Promise<any> = async (where: any) => await prismaClient.log.findUnique({ where });

export const fetchFiles: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.file.findMany({ where });
export const fetchFile: (where: any) => Promise<any> = async (where: any) => await prismaClient.file.findUnique({ where });

/** Intermediary tables */
export const fetchRolePermissions: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.rolePermissions.findMany({ where });
export const fetchRolePermission: (where: any) => Promise<any> = async (where: any) => await prismaClient.rolePermissions.findUnique({ where });

export const fetchUserRoles: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.userRoles.findMany({ where });
export const fetchUserRole: (where: any) => Promise<any> = async (where: any) => await prismaClient.userRoles.findUnique({ where });

export const fetchTaskCommentFiles: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.taskCommentFiles.findMany({ where });
export const fetchTaskCommentFile: (where: any) => Promise<any> = async (where: any) => await prismaClient.taskCommentFiles.findUnique({ where });

export const fetchTaskFiles: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.taskFiles.findMany({ where });
export const fetchTaskFile: (where: any) => Promise<any> = async (where: any) => await prismaClient.taskFiles.findUnique({ where });

export const fetchProjectFiles: (where?: any) => Promise<any[]> = async (where: any = {}) => await prismaClient.projectFiles.findMany({ where });
export const fetchProjectFile: (where: any) => Promise<any> = async (where: any) => await prismaClient.projectFiles.findUnique({ where });
