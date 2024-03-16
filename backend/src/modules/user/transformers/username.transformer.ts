export const setUsernameToLowerCase = (userData: any) => {
  if (!userData.username) return userData;
  return {
    ...userData,
    username: userData.username.toLowerCase(),
  };
};
