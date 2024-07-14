import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './entity/auth.entity';
import { RegisterUserDto } from './dto/registr-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Token) private entity: Token) {}

  async register(dto: RegisterUserDto) {}

  async login() {}
}
