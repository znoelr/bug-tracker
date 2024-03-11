import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TASK_PRIORITY, TASK_SEVERITY, TASK_STATUS, TASK_TYPES } from "../task.constants";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TASK_TYPES))
  type: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TASK_STATUS))
  status: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TASK_SEVERITY))
  severity: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TASK_PRIORITY))
  priority: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  assigneeId: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
