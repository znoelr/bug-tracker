import { v4 as uuid } from 'uuid';
import { logRepository } from "./log.repository";
import { BaseService } from '../base/base.service';
import { LogDto } from './dtos/log.dto';

export class LogService extends BaseService<LogDto> {
  private async createLogPayload(logType: string, entityName: string, record: any, userId: string) {
    await logRepository.create({
      id: uuid(),
      content: `${logType} "${entityName}" entity: \n${JSON.stringify(record, null, 2)}`,
      triggeredById: userId,
    });
  }

  public logNew = this.createLogPayload.bind(this, '[Created]');
  public logUpdate = this.createLogPayload.bind(this, '[Updated]');
  public logDelete = this.createLogPayload.bind(this, '[Deleted]');
}

export const logService = new LogService(logRepository);
