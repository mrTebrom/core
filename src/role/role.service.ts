import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entity/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private entity: typeof Role,
  ) {}

  async findAll(): Promise<Role[] | undefined> {
    // Получение всех ролей
    return await this.entity.findAll();
  }

  async findById(id: number): Promise<Role | undefined> {
    // Поиск по id
    return this.entity.findByPk(id);
  }

  async destroy(id: number): Promise<{ message: string }> {
    const candidate = await this.entity.findByPk(id);
    if (!candidate) {
      throw new HttpException('Роль не найдена', HttpStatus.BAD_REQUEST);
    }
    await candidate.destroy();
    return { message: `Роль "${candidate.value}" удаленна` };
  }

  async create(dto: CreateRoleDto): Promise<{ message: string }> {
    //Создание роли

    const { value } = dto;
    // Проверка на уникальность
    const candidate = await this.entity.findOne({ where: { value } });
    if (candidate) {
      throw new HttpException(
        `"${value}" уже существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.entity.create({
      value: dto.value.toLocaleLowerCase(),
      description: dto.description,
    });

    return { message: 'Роль "' + dto.value.toLocaleLowerCase() + '" созданна' };
  }

  async update(id: number, dto: UpdateRoleDto): Promise<{ message: string }> {
    // Редактирование роли

    const role = await this.findById(id);
    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
    }

    // Проверка на уникальность value, если оно изменяется
    if (dto.value && dto.value !== role.value) {
      const existingRole = await this.entity.findOne({
        where: { value: dto.value },
      });
      if (existingRole) {
        throw new HttpException(
          `"${dto.value}" уже существует`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Обновление роли
    await role.update(dto);

    return { message: `Роль "${role.value}" обновлена` };
  }
}
