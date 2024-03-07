export const userRolesParamsToKey = (params: any) => {
  const { userId, roleId } = params;
  return {
    userId_roleId: {
      userId,
      roleId,
    }
  };
}
