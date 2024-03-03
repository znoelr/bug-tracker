export const TASK_TYPES = ({
  FEATURE: 'FEATURE',
  BUG: 'BUG',
}) as const;

export const TASK_STATUS = ({
  IN_REVIEW: 'IN_REVIEW',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  CLOSED: 'CLOSED',
}) as const;

export const TASK_SEVERITY = ({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  EXTREMELY_HIGH: 'EXTREMELY_HIGH',
}) as const;

export const TASK_PRIORITY = ({
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  NORMAL: 'NORMAL',
  LOW: 'LOW',
}) as const;
