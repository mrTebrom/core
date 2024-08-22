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
  // Поле для имени пользователя (необязательно)
  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @ValidateIf((dto) => !dto.email && !dto.phone) // Валидация: имя обязательно, если нет email и телефона
  @IsNotEmpty({
    message:
      'Имя пользователя не должно быть пустым, если не указан email или номер телефона',
  })
  username?: string;

  // Поле для email пользователя (необязательно)
  @ApiProperty({
    example: 'john@example.com',
    description: 'Электронная почта пользователя',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @ValidateIf((dto) => !dto.username && !dto.phone) // Валидация: email обязателен, если нет имени и телефона
  @IsNotEmpty({
    message:
      'Email не должен быть пустым, если не указано имя пользователя или номер телефона',
  })
  email?: string;

  // Поле для номера телефона пользователя (необязательно)
  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @IsPhoneNumber(null, { message: 'Некорректный номер телефона' })
  @ValidateIf((dto) => !dto.username && !dto.email) // Валидация: телефон обязателен, если нет имени и email
  @IsNotEmpty({
    message:
      'Номер телефона не должен быть пустым, если не указано имя пользователя или email',
  })
  phone?: string;

  // Поле для пароля пользователя (обязательно)
  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(3, { message: 'Пароль должен содержать минимум 3 символов' })
  password: string;
}
