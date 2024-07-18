import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './entity/auth.entity';
import { RegisterUserDto } from './dto/registr-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token) private entity: Token,
    private userService: UserService,

    private jwt: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const user = await this.userService.registration(dto);
    return user;
  }

  async login() {}
}
