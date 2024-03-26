import { createHash } from 'crypto';
import { ConfigService } from '../../config/config.service';

export const hashStr = (data: string): string => {
  const hashKey = ConfigService.get<string>('HASH_KEY');
  const dataToHash = `${data}${hashKey}`;
  return createHash('sha256')
    .update(dataToHash)
    .digest('hex');
}

export const compareHash = (data: string, hash: string): boolean => {
  return hash === hashStr(data);
}
