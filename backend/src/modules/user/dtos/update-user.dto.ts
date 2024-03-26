import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
