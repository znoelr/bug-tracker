import bcrypt from 'bcrypt';

export const hashUserPassword = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return {
    ...userData,
    password: hashedPassword,
  };
};
