import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { User } from '../../user/entity/user.entity';

@Table
export class Token extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  refreshToken: string;
}
