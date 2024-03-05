import path from 'path';
import pinoLogger from 'pino';

export const fileLogger = () => pinoLogger({
  transport: {
    targets: [
      {
        target: path.resolve(__dirname, './sonic-boom.ts'),
        level: 'error',
        options: {
          singleLine: true,
        },
      },
    ],
  },
});
