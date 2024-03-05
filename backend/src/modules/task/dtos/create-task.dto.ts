import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
  
  @IsString()
  @IsNotEmpty()
  type: string;
  
  @IsString()
  @IsNotEmpty()
  status: string;
  
  @IsString()
  @IsOptional()
  severity: string;
  
  @IsString()
  @IsNotEmpty()
  priority: string;
  
  @IsString()
  @IsNotEmpty()
  assigneeId: string;
  
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
