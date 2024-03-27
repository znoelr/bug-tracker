import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  verbose: false,
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testTimeout: 1000 * 60, // 60s
};
export default config;
