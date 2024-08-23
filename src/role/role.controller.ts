import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entity/role.entity';
import { JwtAuthGuard } from 'src/pipe/auth.pipe';
import { RolesGuard } from 'src/pipe/role-admin/role-admin.pipe';
import { Roles } from 'src/decorator/role-admin/roles.decorator';

@ApiTags('role') // Тег для группировки эндпоинтов в Swagger
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // Создание новой роли
  @ApiOperation({ summary: 'Создание новой роли' })
  @ApiResponse({ status: 201, description: 'Роль успешно создана.' })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или роль уже существует.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Проверка на роль admin
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<{ message: string }> {
    try {
      return await this.roleService.create(createRoleDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Получение всех ролей
  @ApiOperation({ summary: 'Получение всех ролей' })
  @ApiResponse({ status: 200, description: 'Список всех ролей.', type: [Role] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager') // Проверка на роль admin или manager
  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  // Обновление существующей роли
  @ApiOperation({ summary: 'Обновление существующей роли' })
  @ApiParam({ name: 'id', description: 'Идентификатор роли', example: 1 })
  @ApiResponse({ status: 200, description: 'Роль успешно обновлена.' })
  @ApiResponse({ status: 404, description: 'Роль не найдена.' })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или роль уже существует.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Только администратор может обновлять роли
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    try {
      return await this.roleService.update(id, updateRoleDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Удаление роли
  @ApiOperation({ summary: 'Удаление роли' })
  @ApiParam({ name: 'id', description: 'Идентификатор роли', example: 1 })
  @ApiResponse({ status: 200, description: 'Роль успешно удалена.' })
  @ApiResponse({ status: 404, description: 'Роль не найдена.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Только администратор может удалять роли
  @Delete(':id')
  async destroy(@Param('id') id: number): Promise<{ message: string }> {
    try {
      return await this.roleService.destroy(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
