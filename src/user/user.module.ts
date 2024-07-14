import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRole } from './entity/user-role.entity';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [SequelizeModule.forFeature([User, UserRole]), RoleModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
