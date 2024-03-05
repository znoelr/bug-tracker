import pinoLogger from 'pino-http';

export const httpLogger = () => pinoLogger({
  transport: {
    target: 'pino-pretty',
    options: {
      singleLine: true,
    },
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    if (res.statusCode >= 300) return 'silent';
    return 'info';
  },
});
