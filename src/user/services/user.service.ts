import { Injectable, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import CreateUserDto from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import constants from '../../common/constants';
import hash from '../../common/hash';
import UpdateUserDto from '../dto/update-user.dto';
import { Role } from '../../role/entities/role.entity';
import { UserRoles } from '../entities/user-roles.entity';
import DefineUserRoleDto from '../dto/define-user-role.dto';
import { Op } from 'sequelize';
import { FilterDto } from 'src/common/filters/filter.dto';
import { SavedFilter } from '../entities/filter.entity';


@Injectable()
export class UserService {
  constructor(
    @Inject(constants.USERS_REPOSITORY)
    private usersRepository: typeof User,
    @Inject(constants.USER_ROLES_REPOSITORY)
    private userRolesRepository: typeof UserRoles,
    @Inject(constants.SAVED_FILTER_REPOSITORY)
    private savedFilterRepository: typeof SavedFilter
  ) { }

  async defineUserRole(define: DefineUserRoleDto): Promise<UserRoles> {
    const definiton = await this.userRolesRepository.create({ userId: define.user_id, roleId: define.role_id });
    return definiton;
  }

  async findOne(id): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, include: [{ model: Role }]});
    return user;
  }

  async findOneByEmail(email): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email }, include: { model: Role } });
    return user;
  }

  async create(newUser: CreateUserDto): Promise<User> {
    newUser.password = hash(newUser.password);
    const user = await this.usersRepository.create({ ...newUser });

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findAll({ include: { all: true } });
    return users;
  }

  async findByFio(fio: string): Promise<User[]> {
    const names = fio.split(' ').filter(name => name.trim().length > 0);

    const whereCondition = {
      [Op.or]: names.map(name => ({
        [Op.or]: [
          { first_name: { [Op.like]: '%' + name + '%' } },
          { last_name: { [Op.like]: '%' + name + '%' } },
          { middle_name: { [Op.like]: '%' + name + '%' } }
        ]
      }))
    };

    return this.usersRepository.findAll({
      where: whereCondition
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | [affectedCount: number]> {
    const user = await this.usersRepository.update(updateUserDto, { where: { id } });
    return user;
  }

  async delete(id: number): Promise<User | number> {
    const user = await this.usersRepository.destroy({ where: { id } });
    return user;
  }


  async updateUsersAvatar(id: number, avatar_salt: string) {
    const user = await this.usersRepository.update({ avatar_salt }, { where: { id } });
    return user;
  }


  async saveUserFilter(userId: number, name: string, service_name: string | null, filters: FilterDto): Promise<SavedFilter> {
    const savedFilter = await this.savedFilterRepository.create({
      user_id: userId,
      name,
      service_name,
      filters: JSON.stringify(filters),
    });
  
    return savedFilter;
  }

  // Получение фильтров пользователя для конкретного сервиса (или всех, если service_name === null)
  async getUserFilters(userId: number, serviceName: string | null): Promise<SavedFilter[]> {
    return this.savedFilterRepository.findAll({
      where: {
        user_id: userId,
        service_name: serviceName !== null ? serviceName : { [Op.is]: null },
      },
    });
  }

   // Удаление фильтра по ID
   async deleteFilter(filterId: number): Promise<void> {
    const filter = await this.savedFilterRepository.findByPk(filterId);
    if (!filter) {
      throw new Error(`Filter with ID ${filterId} not found`);
    }
    await filter.destroy();
  }
  
}
