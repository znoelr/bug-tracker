import { Expose } from "class-transformer";
import { FileDto } from "../../../../../../file/dtos/file.dto";

export class TaskCommentFilesDto {
  @Expose()
  taskCommentId: string;

  @Expose()
  fileId: string;

  @Expose()
  file: FileDto;
}
