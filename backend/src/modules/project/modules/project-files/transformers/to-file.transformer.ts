import { ProjectFilesDto } from "../dtos/project-files.dto";

export const projectFilesToFiles = (data: ProjectFilesDto[]) => data.map(({ file }) => file);

export const projectFileToFile = ({ file }: ProjectFilesDto) => file;
