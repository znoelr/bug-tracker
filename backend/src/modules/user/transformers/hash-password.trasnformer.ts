import bcrypt from 'bcrypt';

export const hashUserPassword = async (userData: any) => {
  if (!userData.password) return userData;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return {
    ...userData,
    password: hashedPassword,
  };
};
