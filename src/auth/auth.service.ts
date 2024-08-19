// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/registr-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/authorization-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService, // Сервис для работы с JWT
    private userService: UserService, // Сервис для работы с пользователями
  ) {}

  // Регистрация пользователя
  async register(dto: RegisterUserDto) {
    // Регистрация пользователя через UserService
    const user = await this.userService.registration(dto);
    // Генерация JWT токена для зарегистрированного пользователя
    return this.generation(user);
  }

  // Авторизация пользователя
  async login(dto: LoginUserDto) {
    // Поиск пользователя по email, телефону или имени пользователя
    const user = await this.userService.findLogin(
      dto.email || dto.phone || dto.username,
    );
    // Генерация JWT токена для авторизованного пользователя
    return await this.generation(user);
  }

  // Генерация JWT токена
  async generation(payload: any) {
    console.log(payload); // Вывод полезной информации о пользователе (для отладки)
    // Создание JWT токена с полезной нагрузкой
    return await this.jwt.sign({
      sub: payload.id, // ID пользователя
      roles: payload.roles.map((item) => {
        return item.value; // Преобразование ролей пользователя в массив значений
      }),
      username: payload.username, // Имя пользователя
      phone: payload.phone, // Телефон пользователя
      email: payload.email, // Email пользователя
    });
  }
}
