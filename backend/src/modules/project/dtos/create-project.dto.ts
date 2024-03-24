import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PROJECT_STATUS } from "../project.constants";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(PROJECT_STATUS))
  status: string;
}
