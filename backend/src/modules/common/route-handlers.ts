import { BaseController } from "../base/base.controller";
import { catchAsync } from "./exception-handlers";
import { GenericFunction } from "./types";

export const routeFactory = (controller: BaseController<any>) =>
  (fn: GenericFunction) => catchAsync(fn.bind(controller));
