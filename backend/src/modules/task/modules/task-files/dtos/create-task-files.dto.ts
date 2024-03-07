import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskFilesDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;
}
