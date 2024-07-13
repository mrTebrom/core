import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRole } from './entity/user-role.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, UserRole])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
