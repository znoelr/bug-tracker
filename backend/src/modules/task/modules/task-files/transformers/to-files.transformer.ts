import { TaskFilesDto } from "../dtos/task-files.dto";

export const taskFilesToFiles = (data: TaskFilesDto[]) => data.map(({ file }) => file);

export const taskFileToFile = ({ file }: TaskFilesDto) => file;
