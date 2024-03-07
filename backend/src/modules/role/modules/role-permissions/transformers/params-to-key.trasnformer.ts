export const rolePermissionsParamsToKey = (params: any) => {
  const { roleId, permissionId } = params;
  return {
    roleId_permissionId: {
      roleId,
      permissionId,
    }
  };
};
