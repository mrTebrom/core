import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registr-auth.dto';
import { LoginUserDto } from './dto/authorization-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('registration')
  async registration(@Body() dto: RegisterUserDto) {
    return this.service.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.service.login(dto);
  }
}
