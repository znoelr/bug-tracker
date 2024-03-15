export class ConfigService {
  static get<T>(key: string): T {
    return process.env[key] as T;
  }
}

export const configService = new ConfigService();
