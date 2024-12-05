import { Controller, Request, Post, UseGuards, Body, Get, Res, Query, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { Response } from 'express';


@ApiTags('Авторизация')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, 
  ) { }

  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({ status: 200, description: 'Токен успешно обновлен' })
  @ApiResponse({ status: 401, description: 'Недействительный refresh токен' })
  @ApiBearerAuth()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Информация о профиле пользователя' })
  @ApiResponse({ status: 401, description: 'Токен недействителен или отсутствует' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('profile')
  async getProfile(@Request() req) {
    const user = await this.authService.getMyInfo(req.user.sub.id);
    delete user.password;

    return user;
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователю отправлена ссылка на подтверждение' })
  @ApiResponse({ status: 400, description: 'Пользователь уже зарегистрирован' })
  @ApiBody({ type: CreateUserDto })
  @Post('registration')
  async postNewUser(@Body() createUser: CreateUserDto) {
    return await this.authService.postNewUser(createUser);
  }

  @ApiOperation({ summary: 'Подтвердить регистрацию пользователя' })
  @ApiResponse({ status: 200, description: 'Регистрация подтверждена' })
  @ApiResponse({ status: 404, description: 'Не найдено подтверждение' })
  @ApiQuery({ name: 'u', description: 'Параметр подтверждения u', required: true })
  @ApiQuery({ name: 'c', description: 'Параметр подтверждения c', required: true })
  @Get('confirmRegistration')
  async confirmRegistration(@Query('u') u: string, @Query('c') c: string, @Res() res: Response) {
    const result = await this.authService.confirmRegistration(u, c);

    return res.send(result.message);
  }



}
