import { envSchema } from './schema';

export const init = () => {
  const { error } = envSchema.validate(process.env, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.message);
  }
};
