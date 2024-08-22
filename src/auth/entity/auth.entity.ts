import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { User } from '../../user/entity/user.entity';

@Table({ tableName: 'token' }) // Аннотация указывает, что это таблица в базе данных
export class Token extends Model {
  // Внешний ключ, связывающий с пользователем
  @ForeignKey(() => User)
  @Column
  userId: number;

  // Поле для хранения refresh токена
  @Column({
    type: DataType.STRING, // Тип данных - строка
    allowNull: false, // Поле обязательно для заполнения
  })
  refreshToken: string;

  @Column({
    type: DataType.DATE,
  })
  expiresAt: Date;
}
