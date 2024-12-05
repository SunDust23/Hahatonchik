import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { usersProvider } from './providers/user.providers';
import { SequelizeModule } from '../sequelize/sequelize.module';
import { RoleService } from 'src/role/services/role.service';

import { FindService } from 'src/common/filters/find.service';
@Module({
  imports: [SequelizeModule],
  controllers: [UserController],
  providers: [
    UserService,
    RoleService,
    FindService,
    ...usersProvider
  ],
})

export class UserModule { }