import mongoose from 'mongoose';
import { ConfigService } from '../../config/config.service';

const oneDayInSeconds = 60 * 60 * 24;
const expiresInSeconds = Number(ConfigService.get<number>('JWT_EXPIRES_IN_DAYS')) * oneDayInSeconds;

const tokenBlackListSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    expires: expiresInSeconds,
    default: Date.now,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

export const TokenBlacklistModel = mongoose.model('TokenBlacklist', tokenBlackListSchema);
