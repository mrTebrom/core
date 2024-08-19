import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UserPipe } from './pipe/user.pipe';
import { JwtAuthGuard } from 'src/pipe/auth.pipe';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: 'Создание нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан.' })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или пользователь уже существует.',
  })
  @Post()
  @UsePipes(UserPipe)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    try {
      return await this.service.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список всех пользователей.',
    type: [User],
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Получение пользователя по идентификатору' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Пользователь найден.', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    return this.service.findById(id);
  }

  @ApiOperation({ summary: 'Обновление существующего пользователя' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен.' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или пользователь уже существует.',
  })
  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    try {
      return await this.service.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален.' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  @Delete(':id')
  async destroy(@Param('id') id: number): Promise<{ message: string }> {
    try {
      return await this.service.destroy(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
