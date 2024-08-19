import { User } from './../user/entity/user.entity';
import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { Token } from './entity/auth.entity';
// import { RegisterUserDto } from './dto/registr-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/registr-auth.dto';

@Injectable()
export class AuthService {
  // constructor(@InjectModel(Token) private entity: Token) {}
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findLogin(username);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
  async generation(user: User) {
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email,
      roles: user.roles,
    });
  }
  async registration(dto: RegisterUserDto) {
    // Регистрация пользователья
    const candidate = await this.usersService.registration(dto);
    return this.generation(candidate);
  }
}
