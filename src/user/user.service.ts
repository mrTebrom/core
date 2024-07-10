import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private entity: typeof User,
  ) {}

  // Метод для создания нового пользователя
  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email, username, phone, password } = createUserDto;

    // Проверка на уникальность email, username и phone
    if (email) {
      const existingUserByEmail = await this.entity.findOne({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new HttpException(
          `Пользователь с email "${email}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (username) {
      const existingUserByUsername = await this.entity.findOne({
        where: { username },
      });
      if (existingUserByUsername) {
        throw new HttpException(
          `Пользователь с именем "${username}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (phone) {
      const existingUserByPhone = await this.entity.findOne({
        where: { phone },
      });
      if (existingUserByPhone) {
        throw new HttpException(
          `Пользователь с номером телефона "${phone}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Хеширование пароля перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    await this.entity.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    return { message: `Пользователь "${username || email || phone}" создан` };
  }

  // Метод для получения всех пользователей
  async findAll(): Promise<User[]> {
    return this.entity.findAll();
  }

  // Метод для получения пользователя по ID
  async findById(id: number): Promise<User | undefined> {
    const user = await this.entity.findByPk(id);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // Метод для обновления данных пользователя
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(id);

    // Проверка на уникальность email, username и phone, если они изменяются
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUserByEmail = await this.entity.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUserByEmail) {
        throw new HttpException(
          `Пользователь с email "${updateUserDto.email}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUserByUsername = await this.entity.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUserByUsername) {
        throw new HttpException(
          `Пользователь с именем "${updateUserDto.username}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUserByPhone = await this.entity.findOne({
        where: { phone: updateUserDto.phone },
      });
      if (existingUserByPhone) {
        throw new HttpException(
          `Пользователь с номером телефона "${updateUserDto.phone}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Обновление данных пользователя
    await user.update(updateUserDto);

    return {
      message: `Пользователь "${user.username || user.email || user.phone}" обновлен`,
    };
  }

  // Метод для удаления пользователя по ID
  async destroy(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    // Удаление пользователя
    await user.destroy();
    return {
      message: `Пользователь "${user.username || user.email || user.phone}" удален`,
    };
  }
}
