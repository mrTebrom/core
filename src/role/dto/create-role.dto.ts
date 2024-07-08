import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  // Поле value должно быть строкой и не должно быть пустым
  @ApiProperty({ example: 'admin', description: 'Название роли' })
  @IsString({ message: 'Значение роли должно быть строкой' })
  @IsNotEmpty({ message: 'Значение роли не должно быть пустым' })
  value: string; // Название роли

  // Поле description должно быть строкой
  @ApiProperty({
    example: 'Роль администратора с полным доступом',
    description: 'Описание роли',
  })
  @IsString({ message: 'Описание роли должно быть строкой' })
  description: string; // Описание роли
}
