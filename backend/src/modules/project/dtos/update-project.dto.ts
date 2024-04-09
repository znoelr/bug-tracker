import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PROJECT_STATUS } from "../project.constants";

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(PROJECT_STATUS))
  status: string;
}
