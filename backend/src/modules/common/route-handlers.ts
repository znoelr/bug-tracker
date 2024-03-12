import { BaseController } from "../base/base.controller";
import { catchAsync } from "./exception-handlers";
import { GenericFunction, RequesOptions } from "./types";

const defaultRequestOptions: RequesOptions = {
  endRequest: true,
};

export const routeFactory = (controller: BaseController<any>) =>
  (fn: GenericFunction, reqOptions: RequesOptions = defaultRequestOptions) =>
    catchAsync(fn.bind(controller, reqOptions))
;
