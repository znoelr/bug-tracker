export const PERMISSION_ACTION = ({
  GET: 'GET',
  LIST: 'LIST',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
}) as const;

export const PERMISSION_RESOURCE = ({
  ROLE: 'ROLE',
  BUG: 'BUG',
  FEATURE: 'FEATURE',
  PROJECT: 'PROJECT',
  USER: 'USER',
  FILE: 'FILE',
  BUG_COMMENT: 'BUG_COMMENT',
  FEATURE_COMMENT: 'FEATURE_COMMENT',
  TASK_LOG: 'TASK_LOG',
}) as const;
