import * as Joi from 'joi';

export const envSchema  = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN_SECONDS: Joi.number().required(),
  JWT_EXPIRES_IN_DAYS: Joi.number().required(),
  HASH_KEY: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  MONGO_URL: Joi.string().required(),
  LOG_FOLDER: Joi.string().required(),
  USER_ROLES_EXPIRES_IN_SECONDS: Joi.number().required(),
});
