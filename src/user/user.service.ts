import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private entity: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email } = createUserDto;

    // Проверка на уникальность email
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(
        `Пользователь с email "${email}" уже существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userModel.create({
      username: createUserDto.username,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: createUserDto.password, // Обратите внимание: Пароль должен быть захеширован перед сохранением
    });

    return { message: `Пользователь "${createUserDto.username}" создан` };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(id);

    // Проверка на уникальность email, если он изменяется
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new HttpException(
          `Пользователь с email "${updateUserDto.email}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await user.update(updateUserDto);

    return { message: `Пользователь "${user.username}" обновлен` };
  }

  async destroy(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await user.destroy();
    return { message: `Пользователь "${user.username}" удален` };
  }
}
