import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Электронная почта пользователя',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @IsPhoneNumber(null, { message: 'Некорректный номер телефона' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(3, { message: 'Пароль должен содержать минимум 3 символов' })
  password: string;

  @ValidateIf((o) => !o.username && !o.email && !o.phone)
  @IsNotEmpty({
    message:
      'По крайней мере одно из полей username, email или phone должно быть заполнено',
  })
  dummy: string;
}
