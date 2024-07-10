import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserPipe implements PipeTransform {
  transform(value: CreateUserDto) {
    const { username, email, phone } = value;

    if (!username && !email && !phone) {
      throw new BadRequestException(
        'По крайней мере одно из полей username, email или phone должно быть заполнено',
      );
    }

    if (username) {
      value.username = username.toLowerCase();
    }

    if (email) {
      value.email = email.toLowerCase();
    }

    if (phone) {
      value.phone = phone.toLowerCase();
    }

    value.password = value.password.toLowerCase();

    return value;
  }
}
