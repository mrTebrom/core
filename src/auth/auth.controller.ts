import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registr-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.service.register(dto);
  }
}
