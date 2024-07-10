import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserPipe implements PipeTransform {
  transform(value: CreateUserDto | UpdateUserDto) {
    console.log('Pipe transform called');

    // Проверяем, что значение является объектом
    if (typeof value !== 'object' || value === null) {
      throw new BadRequestException('Invalid data format');
    }

    // Пропускаем пустые объекты
    if (Object.keys(value).length === 0) {
      return value;
    }

    let { username, email, phone } = value;

    console.log(`username=${username} email=${email} phone=${phone}`);
    console.log('value=', value);

    // Убедимся, что поля имеют правильные типы данных
    username = username && typeof username === 'string' ? username : undefined;
    email = email && typeof email === 'string' ? email : undefined;
    phone = phone && typeof phone === 'string' ? phone : undefined;

    // Проверка наличия хотя бы одного из полей
    if (!username && !email && !phone) {
      console.log('error');
      throw new BadRequestException(
        'По крайней мере одно из полей username, email или phone должно быть заполнено',
      );
    }

    // Приводим значения полей к нижнему регистру при наличии данных
    if (username) {
      value.username = username.toLowerCase();
    }

    if (email) {
      value.email = email.toLowerCase();
    }

    if (phone) {
      value.phone = phone.toLowerCase();
    }

    if (value.password && typeof value.password === 'string') {
      value.password = value.password.toLowerCase();
    }

    return value;
  }
}
