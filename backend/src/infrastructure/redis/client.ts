import { createClient } from 'redis';
import { ConfigService } from '../../config/config.service';

export const client = createClient({
  url: ConfigService.get<string>('REDIS_URL'),
});

client.on('error', (err) => console.log('[REDIS CLIENT ERROR]', err));

export const connectRedis = async () => await client.connect();
export const disconnectRedis = async () => await client.disconnect();

