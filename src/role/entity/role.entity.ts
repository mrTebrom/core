import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRoleDto } from '../dto/create-role.dto';
import { User } from '../../user/entity/user.entity';
import { UserRole } from '../../user/entity/user-role.entity';

@Table({
  tableName: 'roles',
  timestamps: true, // Если вам нужны поля createdAt и updatedAt
})
export class Role extends Model<CreateRoleDto, Role> {
  // Первичный ключ с автоматической генерацией значения
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор роли' })
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number; // id роли

  // Поле value должно быть строкой и не должно быть пустым
  @ApiProperty({ example: 'admin', description: 'Название роли' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  value: string; // Название роли

  // Поле description должно быть строкой
  @ApiProperty({
    example: 'Роль администратора с полным доступом',
    description: 'Описание роли',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string; // Описание роли

  @BelongsToMany(() => User, () => UserRole)
  users: Role[];
}
