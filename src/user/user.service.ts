import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';
import { RegisterUserDto } from 'src/auth/dto/registr-auth.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private entity: typeof User,

    private roleService: RoleService,
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
    const user = await this.entity.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    // получение ролей
    const roles = await this.roleService.findByIds(createUserDto.roles);
    // сахранение ролей
    user.$set('roles', roles);

    return { message: `Пользователь "${username || email || phone}" создан` };
  }

  // Метод для получения всех пользователей
  async findAll(): Promise<User[]> {
    return this.entity.findAll({ include: 'roles' });
  }

  // Метод для получения пользователя по ID
  async findById(id: number): Promise<User | null> {
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
    const updateUser = await user.update(updateUserDto);

    // получение ролей
    const roles = await this.roleService.findByIds(updateUserDto.roles);
    // сахранение ролей
    updateUser.$set('roles', roles);

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

  // Регистрация пользователья
  async registration(dto: RegisterUserDto): Promise<User> {
    const { email, username, phone, password } = dto;

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
    const user = await this.entity.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    // Получение роли пользователья
    const role = await this.roleService.findUserRole();
    // сахранение ролей
    await user.$set('roles', role);

    return user;
  }

  async findLogin(identifier: string): Promise<User | null> {
    return this.entity.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { phone: identifier },
          { email: identifier },
        ],
      },
    });
  }
}
