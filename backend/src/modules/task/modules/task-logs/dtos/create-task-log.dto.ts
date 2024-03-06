import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskLogDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  triggeredById: string;
}
