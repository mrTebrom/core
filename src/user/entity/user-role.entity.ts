import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from '../../role/entity/role.entity';

@Table({ tableName: 'z-user-role' })
export class UserRole extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Role)
  @Column
  roleId: number;
}
