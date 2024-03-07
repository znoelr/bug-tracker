import { Expose } from "class-transformer";
import { FileDto } from "../../../../file/dtos/file.dto";

export class ProjectFilesDto {
  @Expose()
  projectId: string;

  @Expose()
  fileId: string;

  @Expose()
  file: FileDto;
}
