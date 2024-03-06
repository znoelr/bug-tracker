import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  createdById: string;
}
