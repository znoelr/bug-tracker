import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TASK_PRIORITY, TASK_SEVERITY, TASK_STATUS, TASK_TYPES } from "../task.constants";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TASK_TYPES))
  type: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TASK_SEVERITY))
  severity: string;
  
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TASK_PRIORITY))
  priority: string;
  
  @IsString()
  @IsNotEmpty()
  assigneeId: string;
  
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
