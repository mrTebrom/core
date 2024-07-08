import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  // Поле value должно быть строкой и не должно быть пустым
  @IsString({ message: 'Значение роли должно быть строкой' })
  @IsNotEmpty({ message: 'Значение роли не должно быть пустым' })
  value: string; // Название роли

  // Поле description должно быть строкой
  @IsString({ message: 'Описание роли должно быть строкой' })
  description: string; // Описание роли
}
