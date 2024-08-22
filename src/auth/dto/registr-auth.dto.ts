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
  // Имя пользователя (необязательно)
  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsOptional() // Указывает, что поле не является обязательным
  username?: string;

  // Электронная почта (необязательно)
  @ApiProperty({
    example: 'john@example.com',
    description: 'Электронная почта пользователя',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsOptional() // Поле не является обязательным
  email?: string;

  // Номер телефона (необязательно)
  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @IsPhoneNumber(null, { message: 'Некорректный номер телефона' })
  @IsOptional() // Поле не является обязательным
  phone?: string;

  // Пароль (обязательно)
  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(3, { message: 'Пароль должен содержать минимум 3 символа' })
  password: string;

  // Валидация: по крайней мере одно из полей username, email или phone должно быть заполнено
  @ValidateIf((dto) => !dto.username && !dto.email && !dto.phone)
  @IsNotEmpty({
    message:
      'По крайней мере одно из полей username, email или phone должно быть заполнено',
  })
  dummy: string; // Вспомогательное поле для выполнения этой проверки
}
