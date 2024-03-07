import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectFilesDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;
}
