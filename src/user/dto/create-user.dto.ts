import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  // Поле username должно быть строкой
  @ApiProperty({
    example: 'erjan',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsOptional()
  username?: string;

  // Поле email должно быть валидным email адресом
  @ApiProperty({
    example: 'erjan@example.com',
    description: 'Электронная почта пользователя',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsOptional()
  email?: string;

  // Поле phone должно быть валидным номером телефона с кодом страны
  @ApiProperty({
    example: '+77011234567',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @Matches(/^\+?[78]\d{10}$/, {
    message:
      'Некорректный номер телефона. Номер должен начинаться с +7 или 8 и содержать 10 цифр после кода страны.',
  })
  @IsOptional()
  phone?: string;

  // Поле password должно быть строкой, не должно быть пустым и должно содержать минимум 8 символов
  @ApiProperty({ example: 'qwerty123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;
}
