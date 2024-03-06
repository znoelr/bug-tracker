import * as Joi from 'joi';

export const envSchema  = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
});
