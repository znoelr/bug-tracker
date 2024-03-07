import { Expose } from "class-transformer";
import { FileDto } from "../../../../file/dtos/file.dto";

export class TaskFilesDto {
  @Expose()
  taskId: string;

  @Expose()
  fileId: string;

  @Expose()
  file: FileDto;
}
