import { cachePermissionsAccess } from "../common/helpers/cache.helpers";
import { connectMongo } from "./mongodb";
import { connectRedis } from "./redis";

export const initInfrastructure = async () => {
  await connectMongo();
  await connectRedis();
  await cachePermissionsAccess();
};
