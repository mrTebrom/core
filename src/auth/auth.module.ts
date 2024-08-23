import { SequelizeModule } from '@nestjs/sequelize';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { Token } from './entity/auth.entity';
import { RefreshTokenStrategy } from 'src/strategy/refresh-jwt.strategy';

@Global()
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
    // JwtModule.registerAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get<string>('REFRESH'), // Секрет для refresh токенов
    //     signOptions: { expiresIn: '7d' }, // Длительный срок действия для refresh токенов
    //   }),
    //   inject: [ConfigService],
    // }),

    UserModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  exports: [JwtModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
