import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecializationDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
