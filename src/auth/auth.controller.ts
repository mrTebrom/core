import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registr-auth.dto';
import { LoginUserDto } from './dto/authorization-auth.dto';
import { JwtAuthGuard } from 'src/pipe/auth.pipe';

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
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async t() {
    return 'd';
  }
}
