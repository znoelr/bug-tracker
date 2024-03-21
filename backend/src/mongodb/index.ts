import mongoose from 'mongoose';
import { ConfigService } from '../config/config.service';

export const connectMongo = async () => {
  await mongoose.connect(ConfigService.get<string>('MONGO_URL'));
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
};
