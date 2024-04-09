import { BaseController } from "../base/base.controller";
import { LogDto } from "./dtos/log.dto";
import { logService } from "./log.service";

class LogController extends BaseController<LogDto> {}

export default new LogController(LogDto,logService);
