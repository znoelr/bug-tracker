import path from 'path';
import pinoLogger from 'pino';

const targets = process.env.NODE_ENV !== 'test'
  ? [
      {
        target: path.resolve(__dirname, './sonic-boom.ts'),
        level: 'error',
        options: {
          singleLine: true,
        },
      },
    ]
  : [];

export const fileLogger = () => pinoLogger({
  transport: {
    targets,
  },
});
