// src/strategy/refresh-jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка
      secretOrKey: process.env.REFRESH, // Секрет для проверки refresh токенов
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    // Проверка полезной нагрузки и возвращение пользователя
    return payload;
  }
}
