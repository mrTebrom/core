import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { CreateSpecializationDto } from '../dto/create-specialization.dto';

@Table({ tableName: 'specializations' })
export class Specialization extends Model<
  Specialization,
  CreateSpecializationDto
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    comment: 'Название специальности',
  })
  value: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    comment: 'Название специальности',
  })
  url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Название специальности',
  })
  description: string;
}
