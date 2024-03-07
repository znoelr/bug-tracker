import express from "express";
import controller from './user-roles.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import { appendQueryOptions, injectParamsForQueryFilter, parseParamsForQueryFilter } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { userRoleToRole, userRolesParamsToKey, userRolesToRoles } from "./transformers";
import { CrateUserRolesDto } from "./dtos/create-user-roles.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:userId' */

const defaultqueryOptions = new QueryOptions()
  .setInclude({ role: true })

router.use(appendQueryOptions(defaultqueryOptions));

router.route('/')
  .all(parseParamsForQueryFilter())
  .get(
    jsonInterceptor(userRolesToRoles),
    createRoute(controller.findAll)
  )
  .post(
    validateDto(CrateUserRolesDto),
    createRoute(controller.create)
  );

router.route('/:roleId')
  .all(
    jsonInterceptor(userRoleToRole),
    injectParamsForQueryFilter(userRolesParamsToKey)
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
