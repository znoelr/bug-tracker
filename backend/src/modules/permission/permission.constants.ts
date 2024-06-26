export const PERMISSION_ACTION = ({
  GET: 'GET',
  LIST: 'LIST',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
}) as const;

export const PERMISSION_RESOURCE = ({
  PERMISSION: 'PERMISSION',
  ROLE: 'ROLE',
  ROLE_PERMISSION: 'ROLE_PERMISSION',
  USER: 'USER',
  USER_ROLE: 'USER_ROLE',
  TASK: 'TASK',
  TASK_FILE: 'TASK_FILE',
  TASK_COMMENT: 'TASK_COMMENT',
  TASK_COMMENT_FILE: 'TASK_COMMENT_FILE',
  LOG: 'LOG',
  PROJECT: 'PROJECT',
  PROJECT_FILE: 'PROJECT_FILE',
  FILE: 'FILE',
}) as const;
