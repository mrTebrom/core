import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entity/role.entity';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
})
export class RoleModule {}
