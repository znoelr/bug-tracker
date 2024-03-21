import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tokenBlackListSchema = new Schema({
  expireAt: {
    type: Date,
    expires: 20,
    default: Date.now,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

export const TokenBlacklistModel = mongoose.model('TokenBlacklist', tokenBlackListSchema);
