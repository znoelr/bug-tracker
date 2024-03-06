import { IsMimeType, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMimeType()
  mimetype: string;

  @IsUrl()
  url: string;
}
