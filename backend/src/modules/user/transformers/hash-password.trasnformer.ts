import { hashStr } from '../../common/helpers';

export const hashUserPassword = async (userData: any) => {
  if (!userData.password) return userData;
  const hashedPassword = await hashStr(userData.password);
  return {
    ...userData,
    password: hashedPassword,
  };
};
