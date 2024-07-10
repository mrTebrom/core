import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
  Validate,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AtLeastOne } from '../validators/at-least-one-validator';

export class CreateUserDto {
  // Поле username должно быть строкой
  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsOptional()
  username: string;

  // Поле email должно быть валидным email адресом
  @ApiProperty({
    example: 'john@example.com',
    description: 'Электронная почта пользователя',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsOptional()
  email: string;

  // Поле phone должно быть валидным номером телефона
  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @IsPhoneNumber(null, { message: 'Некорректный номер телефона' })
  @IsOptional()
  phone: string;

  // Поле password должно быть строкой, не должно быть пустым и должно содержать минимум 8 символов
  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;

  @Validate(AtLeastOne, [['username', 'email', 'phone']], {
    message:
      'По крайней мере одно из полей username, email или phone должно быть заполнено',
  })
  @ApiProperty({
    description:
      'По крайней мере одно из полей username, email или phone должно быть заполнено',
    required: true,
  })
  _: string; // Это поле используется только для проверки валидатора AtLeastOne и не будет сохраняться
}
