import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entity/role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  providers: [RoleService],
})
export class RoleModule {}
