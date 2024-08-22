// src/strategy/refresh-jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh; // Извлекаем рефреш-токен из cookies
        },
      ]),
      secretOrKey: process.env.REFRESH, // Секретный ключ для валидации рефреш-токена
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies.refresh;
    // Возвращаем payload и рефреш-токен для дальнейшей валидации
    return { ...payload, refreshToken };
  }
}
