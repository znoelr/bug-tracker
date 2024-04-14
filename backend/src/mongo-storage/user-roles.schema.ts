import mongoose from 'mongoose';
import { ConfigService } from '../config/config.service';

const userRolesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  createdAt: {
    type: Date,
    expires: Number(ConfigService.get<number>('USER_ROLES_EXPIRES_IN_SECONDS')),
    default: Date.now,
  },

  rolesIds: {
    type: [String],
    required: true,
    default: () => [],
  },
});

export const UserRolesModel = mongoose.model('UserRoles', userRolesSchema);
