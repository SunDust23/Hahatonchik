import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-vkontakte';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      clientID: process.env.VK_CLIENT_ID, // ID приложения
      clientSecret: process.env.VK_CLIENT_SECRET, // Секретный ключ
      callbackURL: process.env.VK_CALLBACK_URL, // URL для обратного вызова
      scope: ['email'], // Запрашиваемые права
      profileFields: ['id', 'first_name', 'last_name', 'email', 'photo'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { id, first_name, last_name, email } = profile._json;

    // Проверка или создание пользователя
    let user = {
        vk_id: id,
        email: email || null,
        first_name: first_name,
        last_name: last_name,
        password: '', // Для OAuth пользователей можно оставить пустым
      };
    
    const validatedUser = await this.authService.validateVkUser(user);
    done(null, validatedUser);

    return user; // Возвращаем найденного или созданного пользователя
  }
}
