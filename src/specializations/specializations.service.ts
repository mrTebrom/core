import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Specialization } from './entities/specialization.entity';
import { Op } from 'sequelize';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectModel(Specialization) private entity: typeof Specialization,
  ) {}

  // Создание новой специализации
  async create(dto: CreateSpecializationDto) {
    // Проверяем, существует ли специализация с таким же value или url
    const candidate = await this.entity.findOne({
      where: {
        [Op.or]: [{ value: dto.value }, { url: dto.url }],
      },
    });

    // Если такая специализация уже существует, выбрасываем исключение
    if (candidate) {
      throw new HttpException(
        `${dto.value} или ${dto.url} уже используется`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Если всё в порядке, создаём новую запись
    return await this.entity.create(dto);
  }

  // Получение всех специализаций
  async findAll() {
    return await this.entity.findAll();
  }

  // Получение одной специализации по ID
  async findOne(id: number) {
    return await this.entity.findByPk(id);
  }

  // Обновление специализации
  async update(id: number, dto: UpdateSpecializationDto) {
    // Находим специализацию по ID
    const specialization = await this.findOne(id);

    // Если специализация не найдена, выбрасываем исключение
    if (!specialization) {
      throw new HttpException('Специализация не найдена', HttpStatus.NOT_FOUND);
    }

    // Проверка на уникальность value и url, если они изменяются
    if (dto.value || dto.url) {
      const candidate = await this.entity.findOne({
        where: {
          [Op.or]: [
            { value: dto.value || specialization.value },
            { url: dto.url || specialization.url },
          ],
          id: { [Op.ne]: id }, // Исключаем текущую запись из поиска
        },
      });

      // Если другая запись с такими же значениями уже существует, выбрасываем исключение
      if (candidate) {
        throw new HttpException(
          `${dto.value || specialization.value} или ${dto.url || specialization.url} уже используется`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Обновляем запись с новыми данными
    await specialization.update(dto);

    // Возвращаем обновлённую запись
    return specialization;
  }

  // Удаление специализации по ID
  async remove(id: number) {
    return (await this.findOne(id)).destroy();
  }
}
