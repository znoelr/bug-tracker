import express from "express";
import controller from './user-roles.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter, findResourceByRequestQueryFilters } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { CrateUserRolesDto } from "./dtos/create-user-roles.dto";
import { createComposedKeyFromParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../transformers";
import rolePermissionsRouter from '../../../role/modules/role-permissions/role-permissions.router';
import { userRolesService } from "./user-roles.service";
import { UserRolesDto } from "./dtos/user-roles.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:userId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ role: true })
));

router.route('/')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['userId'])
    )
  )
  .get(
    jsonInterceptor(toEntityListForKey('role')),
    createRoute(controller.findAll)
  )
  .post(
    validateDtoAndInjectId(CrateUserRolesDto),
    createRoute(controller.create)
  );

router.route('/:roleId')
  .all(
    injectParamsForQueryFilter(
      createComposedKeyFromParams(['userId', 'roleId'])
    ),
    jsonInterceptor(toEntityForKey('role'))
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:roleId/*',
  injectParamsForQueryFilter(
    createComposedKeyFromParams(['userId', 'roleId'])
  ),
  findResourceByRequestQueryFilters<UserRolesDto>(userRolesService),
);

/** Nested role permissions */
router.use(`/:roleId/permissions`, rolePermissionsRouter);

export default router;
