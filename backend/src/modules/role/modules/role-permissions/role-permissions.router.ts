import express from "express";
import controller from './role-permissions.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter } from "../../../middleware";
import { CreateRolePermissionDto } from "./dtos/create-role-permissions.dto";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { injectComposedKeyIntoParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:roleId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ permission: true })
));

router.route('/')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['roleId'])
    )
  )
  .get(
    jsonInterceptor(toEntityListForKey('permission')),
    createRoute(controller.findAll)
  )
  .post(
    validateDtoAndInjectId(CreateRolePermissionDto),
    createRoute(controller.create)
  );

router.route('/:permissionId')
  .all(
    injectParamsForQueryFilter(
      injectComposedKeyIntoParams(['roleId', 'permissionId'])
    ),
    jsonInterceptor(toEntityForKey('permission'))
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
