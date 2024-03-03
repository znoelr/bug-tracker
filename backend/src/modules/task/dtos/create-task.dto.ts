import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsString()
  @IsNotEmpty()
  type: string;
  
  @IsString()
  @IsNotEmpty()
  status: string;
  
  @IsString()
  @IsNotEmpty()
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
