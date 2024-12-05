import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { rolesProvider } from './providers/role.providers';
import { SequelizeModule } from 'src/sequelize/sequelize.module';

@Module({
  imports: [SequelizeModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    ...rolesProvider,
  ],
})

export class RoleModule {}