// src/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';
export interface JwtPayload {
  id: string;
  username: string;
  phone: string;
  email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Убедись, что этот секретный ключ установлен в .env файле
    });
  }

  async validate(payload: JwtPayload) {
    // payload содержит id пользователя и другие данные

    return payload;
  }
}
