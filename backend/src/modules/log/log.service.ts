import { BaseService } from "../base/base.service";
import { LogDto } from "./dtos/log.dto";
import { logRepository } from "./log.repository";

export class LogService extends BaseService<LogDto> {}

export const logService = new LogService(logRepository);
