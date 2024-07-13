import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @ValidateIf((o) => !o.email && !o.phone)
  @IsNotEmpty({
    message:
      'Имя пользователя не должно быть пустым, если не указан email или номер телефона',
  })
  username?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Электронная почта пользователя',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @ValidateIf((o) => !o.username && !o.phone)
  @IsNotEmpty({
    message:
      'Email не должен быть пустым, если не указано имя пользователя или номер телефона',
  })
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @IsPhoneNumber(null, { message: 'Некорректный номер телефона' })
  @ValidateIf((o) => !o.username && !o.email)
  @IsNotEmpty({
    message:
      'Номер телефона не должен быть пустым, если не указано имя пользователя или email',
  })
  phone?: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(3, { message: 'Пароль должен содержать минимум 3 символов' })
  password: string;
}
