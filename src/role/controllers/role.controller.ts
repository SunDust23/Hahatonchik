import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import CreateRoleDto from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Роли')
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @ApiOperation({ summary: 'Создание новой роли' })
  @ApiResponse({ status: 201, description: 'Роль успешно создана' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiBody({ type: CreateRoleDto })
  @Post('new')
  postNewRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Получить все роли' })
  @ApiResponse({ status: 200, description: 'Список ролей' })
  @Get('all')
  findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: 'Получить роль по ID' })
  @ApiResponse({ status: 200, description: 'Роль найдена' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  @ApiParam({ name: 'id', description: 'ID роли', type: Number })
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить роль по ID' })
  @ApiResponse({ status: 200, description: 'Роль успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  @ApiParam({ name: 'id', description: 'ID роли', type: Number })
  @ApiBody({ type: UpdateRoleDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }


 @ApiOperation({ summary: 'Удалить роль по ID' })
  @ApiResponse({ status: 200, description: 'Роль успешно удалена' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  @ApiParam({ name: 'id', description: 'ID роли', type: Number })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      this.roleService.delete(+id);
      return { message: 'Роль успешно удалена' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
     
  }
}
