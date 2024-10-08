import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// role
import { RoleModule } from './role/role.module';
import { Role } from './role/entity/role.entity';
// user
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';
import { UserRole } from './user/entity/user-role.entity';
// auth
import { AuthModule } from './auth/auth.module';
import { Token } from './auth/entity/auth.entity';
// специальности
import { SpecializationsModule } from './specializations/specializations.module';
import { Specialization } from './specializations/entities/specialization.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadModels: true,
        synchronize: true,
        logging: false,

        models: [Role, User, UserRole, Token, Specialization],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RoleModule,
    UserModule,
    SpecializationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
