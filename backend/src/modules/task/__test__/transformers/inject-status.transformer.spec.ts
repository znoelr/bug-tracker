import { TASK_STATUS } from '../../task.constants';
import { injectTaskStatus } from '../../transformers/inject-status.transformer';

describe('[Inject Status]', () => {
  it('should inject "UNDER_CONSTRUCTION" as default status', () => {
    const body = injectTaskStatus()({});
    expect(body.status).toBe(TASK_STATUS.UNDER_CONSTRUCTION);
  });

  it('should inject the provided status', () => {
    const body = injectTaskStatus(TASK_STATUS.IN_PROGRESS)({});
    expect(body.status).toBe(TASK_STATUS.IN_PROGRESS);
  });
});
