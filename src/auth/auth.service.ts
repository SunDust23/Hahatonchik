import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import hash from '../common/hash';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { checkConfirm, createConfirmationUser } from 'src/helpers/email-confirm';
import { getSuccessConfirmPage } from 'src/helpers/email-confirm/templates';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService,
    private jwsService: JwtService,
  ) { }

  async getMyInfo(id: number) {
    return await this.usersService.findOne(id);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (user && hash(password) == user.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      sub: {
        id: user.dataValues.id,
        first_name: user.dataValues.first_name,
        last_name: user.dataValues.last_name,
        middle_name: user.dataValues.middle_name,
        phone: user.dataValues.phone,
        roles: user.dataValues.roles,
      }
    };
    console.log(user);
    return {
      id: user.dataValues.id,
      accessToken: this.jwsService.sign(payload),
      refreshToken: this.jwsService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async refreshToken(user: User) {
    const payload = {
      username: user.email,
      sub: {
        id: user.dataValues.id,
        first_name: user.dataValues.first_name,
        last_name: user.dataValues.last_name,
        middle_name: user.dataValues.middle_name,
        phone: user.dataValues.phone,
        roles: user.dataValues.roles,
      }
    };
    return {
      accessToken: this.jwsService.sign(payload),
    };
  }


  async decodeToken(token: string) {
    return { user: this.jwsService.decode(token) };
  }

  

  async postNewUser(createUser: CreateUserDto){
    const existingUser = await this.usersService.findOneByEmail(createUser.email);

    if (existingUser) {
      throw new HttpException('Пользователь уже зарегистрирован', HttpStatus.BAD_REQUEST);
    }
  
    // Генерация токена подтверждения
    const confirmationToken = await createConfirmationUser(createUser);
  
    if (!confirmationToken) {
      throw new HttpException('Ошибка при обработке данных', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    return { message: 'Пользователю отправлена ссылка на подтверждение' };

  }

  async confirmRegistration(u: string, c: string) {
    const confirmData = checkConfirm(u, c);
  
    if (!confirmData) {
      throw new HttpException('Подтверждение не найдено', HttpStatus.NOT_FOUND);
    }
  
    // Создание пользователя на основе данных подтверждения
    const newUser = await this.usersService.create(confirmData.UserData);
  
    const page = getSuccessConfirmPage();
    return { message: page, user: newUser };
  }


  async validateVkUser(vkUser: any): Promise<any> {
    const user = await this.usersService.findOneByVkId(vkUser.vkId);
    if (user) {
      return user;
    }
    // Если пользователь не найден, создать его
    return this.usersService.create({
      vk_id: vkUser.vkId,
      first_name: vkUser.firstName,
      last_name: vkUser.lastName,
      email: vkUser.email,
      password: null
    });
  }
}
