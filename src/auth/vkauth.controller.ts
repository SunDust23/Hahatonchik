import { Controller, Post, UseGuards, Body, Get, Res, Query, HttpException, HttpStatus, Inject, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {  Request, Response } from 'express';
import { apiPort, portalUrl } from 'src/config';
import { VkStrategy } from './strategies/vk.strategy';


@ApiTags('Авторизация')
@Controller()
export class VKAuthController {
  constructor(private readonly authService: AuthService, 
  ) { }


  @Get('vk')
  @UseGuards(AuthGuard('vkontakte'))
  async vkAuth() {
    // Редиректит на ВКонтакте
  }

  @Get('vk/callback')
  @UseGuards(VkStrategy)
  async vkAuthCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user; // Пользователь из стратегии
    const jwt = this.authService.login(user); // Генерация JWT токена
    res.redirect(`http://${portalUrl}:${apiPort}?token=${jwt}`); // Редирект с токеном
  }

}
