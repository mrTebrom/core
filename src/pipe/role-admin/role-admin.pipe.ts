import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем роли, которые требуются для доступа
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Если роли не заданы, доступ открыт для всех
    }

    // Извлекаем токен из заголовка Authorization
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    // Верификация токена
    const payload = this.jwtService.verify(token, {
      secret: process.env.SECRET,
    });

    // Проверяем, содержит ли пользователь необходимые роли
    const userRoles = payload.roles;
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
