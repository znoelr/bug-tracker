import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskCommentFilesDto {
  @IsString()
  @IsNotEmpty()
  taskCommentId: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;
}
