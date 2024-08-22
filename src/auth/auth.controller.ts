import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registr-auth.dto';
import { LoginUserDto } from './dto/authorization-auth.dto';
import { JwtAuthGuard } from 'src/pipe/auth.pipe';
import { Request, Response } from 'express';
import { RefreshAuthGuard } from 'src/pipe/refresh.pipe';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('registration')
  async registration(@Body() dto: RegisterUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.service.register(dto);
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // исправлено
    });
    return res.json({ token: accessToken });
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.service.login(dto);
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // исправлено
    });
    return res.json({ token: accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async t() {
    return 'd';
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const oldRefresh = req.cookies.refresh;

    if (!oldRefresh) {
      throw new HttpException(
        'No refresh token provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { accessToken, refreshToken } =
      await this.service.refreshToken(oldRefresh);
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // исправлено
    });
    return res.json({ token: accessToken });
  }
}
