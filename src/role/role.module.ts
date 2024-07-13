import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entity/role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
