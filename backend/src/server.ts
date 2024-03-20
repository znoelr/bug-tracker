import http from 'http';
import { bootstrapApp } from './app';
import { disconnect } from './repository/prisma';
import { disconnectRedis } from './modules/redis';

(async () => {
  const app = await bootstrapApp();
  const httpServer = http.createServer(app);

  const server = httpServer.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
  });

  const closeConnections = (signal: string) => () => {
    console.log(`[${signal}]`);
    server.close(async () => {
      httpServer.closeAllConnections();
      httpServer.close(async () => {
        await disconnect();
        console.log('DB disconnected');
        await disconnectRedis();
        console.log('Redis disconnected');
        console.log('Server closed');
        process.exit(0);
      });
    });
  };

  process.on('SIGINT', closeConnections('SIGINT'));
  process.on('SIGTERM', closeConnections('SIGTERM'));
})();
