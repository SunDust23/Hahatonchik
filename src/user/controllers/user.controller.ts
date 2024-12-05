import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import CreateUserDto from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import UpdateUserDto from '../dto/update-user.dto';
import { createConfirmationUser, checkConfirm } from '../../helpers/email-confirm';
import DefineUserRoleDto from '../dto/define-user-role.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoleService } from 'src/role/services/role.service';

import { UseModel } from 'src/common/decorators/use-model.decorator';
import { User } from '../entities/user.entity';
import { FindInterceptor } from 'src/common/filters/find.interceptor';
import { SavedFilter } from '../entities/filter.entity';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) { }


  @ApiOperation({ summary: 'Обновить аватар пользователя' })
  @ApiResponse({ status: 200, description: 'Аватар успешно обновлен' })
  @Patch('updateAvatar')
  async updateAvatar(@Body() updateUser: UpdateUserDto) {
    const user = await this.userService.findOne(updateUser.id);

    if (!user)
      throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);

    await this.userService.updateUsersAvatar(user.id, updateUser.avatar_salt);
  }

  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  @ApiBody({ type: CreateUserDto })
  @Post('createUser')
  async createUser(@Body() createUser:  CreateUserDto) {
    return await this.userService.create(createUser);
  }



  @ApiOperation({ summary: 'Назначить роль пользователю' })
  @ApiResponse({ status: 200, description: 'Роль назначена' })
  @ApiBody({ type: DefineUserRoleDto })
  @Post('defineRole')
  async defineRole(@Body() defineUserRoleDto: DefineUserRoleDto) {
    const result = await this.userService.defineUserRole(defineUserRoleDto);
    return result;
  }


  @ApiOperation({ summary: 'Получить данные пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Данные пользователя найдены' })
  @ApiParam({ name: 'id', description: 'ID пользователя', required: true })
  @Get('one/:id')
  async findOne(@Param('id') id: number) {
    const { password, ...result } = (await this.userService.findOne(id)).dataValues;
    return result;
  }

  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @Get('all')
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }


  @ApiOperation({ summary: 'Фильтровать пользователей' })
  @ApiResponse({ status: 200, description: 'Список отфильтрованных пользователей успешно возвращён' })
  @ApiResponse({ status: 400, description: 'Некорректные данные фильтра' })
  @ApiBody({ description: 'Данные фильтрации', type: Object }) // Здесь можно уточнить тип, если он известен
  @Post('all')
  @UseModel(User)
  @UseInterceptors(FindInterceptor)
  filterAll(@Body() FilterDto: any) { }

  @ApiOperation({ summary: 'Поиск пользователей по ФИО' })
  @ApiResponse({ status: 200, description: 'Список пользователей успешно найден' })
  @ApiResponse({ status: 404, description: 'Пользователи не найдены' })
  @ApiQuery({ name: 'q', description: 'Часть ФИО для поиска', example: 'Иванов' })
  @Get('fio')
  async findByFio(@Query('q') q: string) {
    const users = await this.userService.findByFio(q);
    return users;
  }

  // DEPRECATED LOGIN MOVED TO AUTH
  // @Post('login')
  // async login(@Body() loginUser: LoginUserDto) {
  //   let foundUser = await this.userService.findOneByEmail(loginUser.email);

  //   if (!foundUser)
  //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);

  //   if (hash(loginUser.password) == foundUser.password)
  //     return foundUser;
  // }
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiParam({ name: 'id', description: 'ID пользователя, который нужно обновить', required: true })
  @ApiBody({ type: UpdateUserDto, description: 'Данные для обновления пользователя' })  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiParam({ name: 'id', description: 'ID пользователя, который нужно удалить', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return  this.userService.delete(+id);
  }



  @ApiOperation({ summary: 'Сохранить фильтр пользователя' })
  @ApiResponse({ status: 201, description: 'Фильтр сохранен' })
  @ApiBearerAuth()
  @Post('newfilter')
  @UseGuards(JwtGuard)
  async saveUserFilter(
    @GetCurrentUser() user: any,
    @Body('name') name: string,
    @Body('filters') FilterDto: any,
  ): Promise<SavedFilter> {
    return await this.userService.saveUserFilter(user.id, name, FilterDto);
  }

  @ApiOperation({ summary: 'Получить фильтры текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Фильтры пользователя' })
  @ApiBearerAuth()
  @Get('myfilters')
  @UseGuards(JwtGuard)
  async getUserFilters(@GetCurrentUser() user: any): Promise<SavedFilter[]> {
    return await this.userService.getUserFilters(user.id);
  }


}
