import path from 'path';
import pinoLogger from 'pino';

const fileTransport = pinoLogger.transport({
  target: path.resolve(__dirname, './sonic-boom'),
  options: {
    singleLine: true,
  },
});

export const getFileLogger = () => pinoLogger({
  level: 'error',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: () => {
    const [, now] = new Date().toISOString().split('T');
    console.log({now});
    return `,"time":"${now}"`;
  },
},
fileTransport);
