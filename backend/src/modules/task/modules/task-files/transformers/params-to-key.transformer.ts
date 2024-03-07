export const taskFilesParamsToKey = (params: any) => {
  const { taskId, fileId } = params;
  return {
    taskId_fileId: {
      taskId,
      fileId,
    },
  };
};