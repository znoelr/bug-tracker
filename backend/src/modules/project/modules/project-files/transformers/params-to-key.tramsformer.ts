export const projectFilesParamsToKey = (params: any) => {
  const { projectId, fileId } = params;
  return {
    projectId_fileId: {
      projectId,
      fileId,
    },
  };
};
