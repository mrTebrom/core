import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { Token } from './entity/auth.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Token]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),

    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
