import { TASK_STATUS } from "../task.constants";

export const injectTaskStatus = (status?: typeof TASK_STATUS[keyof typeof TASK_STATUS]) => (body: any) => {
  return {
    ...body,
    status: status || TASK_STATUS.UNDER_CONSTRUCTION,
  }
};
