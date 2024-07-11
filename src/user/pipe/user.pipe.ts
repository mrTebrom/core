import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserPipe implements PipeTransform {
  transform(value: CreateUserDto | UpdateUserDto) {
    console.log('Pipe transform called');
    console.log('Incoming value:', value);

    // // Проверяем, что значение является объектом
    // if (typeof value !== 'object' || value === null) {
    //   throw new BadRequestException('Invalid data format');
    // }

    // // Пропускаем пустые объекты
    // if (Object.keys(value).length === 0) {
    //   console.log('Empty object passed, returning value');
    //   return value;
    // }

    const { username, email, phone } = value;

    console.log(`username=${username}, email=${email}, phone=${phone}`);

    // Убедимся, что поля имеют правильные типы данных
    if (username && typeof username !== 'string') {
      throw new BadRequestException('Invalid type for username');
    }
    if (email && typeof email !== 'string') {
      throw new BadRequestException('Invalid type for email');
    }
    if (phone && typeof phone !== 'string') {
      throw new BadRequestException('Invalid type for phone');
    }

    // Проверка наличия хотя бы одного из полей
    if (!username && !email && !phone) {
      throw new BadRequestException(
        'По крайней мере одно из полей username, email или phone должно быть заполнено',
      );
    }

    // Приводим значения полей к нижнему регистру при наличии данных
    if (username) {
      value.username = username.toLowerCase();
      console.log('Transformed username:', value.username);
    }

    if (email) {
      value.email = email.toLowerCase();
      console.log('Transformed email:', value.email);
    }

    if (phone) {
      value.phone = phone.toLowerCase();
      console.log('Transformed phone:', value.phone);
    }

    if (value.password && typeof value.password === 'string') {
      value.password = value.password.toLowerCase();
      console.log('Transformed password:', value.password);
    }

    console.log('Transformed value:', value);
    return value;
  }
}
