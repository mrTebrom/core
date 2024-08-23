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
import { RolesGuard } from 'src/pipe/role-admin/role-admin.pipe';
import { Roles } from '../decorator/role-admin/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('auth') // Тег для группировки эндпоинтов в Swagger
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован.',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post('registration')
  async registration(@Body() dto: RegisterUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.service.register(dto);
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json({ token: accessToken });
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно авторизован.',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Некорректные учетные данные.' })
  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.service.login(dto);
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json({ token: accessToken });
  }

  @ApiOperation({ summary: 'Тестовый маршрут для администраторов' })
  @ApiResponse({ status: 200, description: 'Тестовый ответ.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/')
  async t() {
    return 'Тестовый маршрут доступен';
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiCookieAuth('refresh') // Добавление информации о куки в Swagger
  @ApiResponse({
    status: 200,
    description: 'Токен успешно обновлен.',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh токен не предоставлен.' })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const oldRefresh = req.cookies.refresh;

    if (!oldRefresh) {
      throw new HttpException(
        'Refresh токен не предоставлен',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { accessToken, refreshToken } =
      await this.service.refreshToken(oldRefresh);
    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json({ token: accessToken });
  }
}
