import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService],
})
export class UserModule {}
