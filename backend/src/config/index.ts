// import dotenv from 'dotenv';
import { envSchema } from './schema';

// dotenv.config({ path: envFilePath });

export const init = () => {
  const { error } = envSchema.validate(process.env, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.message);
  }
};
