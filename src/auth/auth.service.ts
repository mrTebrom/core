// src/auth/auth.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/registr-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/authorization-auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './entity/auth.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService, // Сервис для работы с JWT
    private userService: UserService, // Сервис для работы с пользователями
    @InjectModel(Token)
    private entity: typeof Token, // Модель для работы с рефреш токенами
  ) {}

  // Регистрация пользователя
  async register(dto: RegisterUserDto) {
    // Регистрация пользователя через UserService
    const user = await this.userService.registration(dto);
    // Генерация JWT и рефреш токенов для зарегистрированного пользователя
    return this.generateTokens(user);
  }

  // Авторизация пользователя
  async login(dto: LoginUserDto) {
    // Поиск пользователя по email, телефону или имени пользователя
    const user = await this.userService.findLogin(
      dto.email || dto.phone || dto.username,
    );
    // Генерация JWT и рефреш токенов для авторизованного пользователя
    return this.generateTokens(user);
  }

  // Генерация JWT и рефреш токенов
  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Создание JWT токена с полезной нагрузкой
    const accessToken = await this.jwt.sign({
      sub: user.id, // ID пользователя
      roles: user.roles.map((role) => role.value), // Преобразование ролей пользователя в массив значений
      username: user.username, // Имя пользователя
      phone: user.phone, // Телефон пользователя
      email: user.email, // Email пользователя
    });

    // Генерация рефреш токена
    const refreshToken = await this.jwt.sign(
      { sub: user.id },
      { expiresIn: '7d', secret: process.env.REFRESH }, // Рефреш токен может иметь более длительный срок действия
    );

    // Удаление старого рефреш токена для текущего пользователя
    await this.entity.destroy({ where: { userId: user.id } });

    // Создание нового рефреш токена
    await this.entity.create({
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Установка срока действия 7 дней
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // Обновление токенов по рефреш токену
  async refreshToken(oldRefreshToken: string) {
    // Поиск токена в базе данных
    const tokenRecord = await this.entity.findOne({
      where: { refreshToken: oldRefreshToken },
    });
    // Проверка на наличие и срок действия рефреш токена
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new NotFoundException('Неверный или просроченный рефреш токен');
    }
    // Поиск пользователя по ID из рефреш токена
    const user = await this.userService.findById(tokenRecord.userId);
    return this.generateTokens(user);
  }
}
