import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<CreateUserDto, User> {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя',
  })
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Имя пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Электронная почта пользователя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}
