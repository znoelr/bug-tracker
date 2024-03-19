import * as Joi from 'joi';

export const envSchema  = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN_SECONDS: Joi.number().required(),
  HASH_KEY: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
});
