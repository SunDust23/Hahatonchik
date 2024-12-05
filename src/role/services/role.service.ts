import { Inject, Injectable } from '@nestjs/common';
import CreateRoleDto from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../entities/role.entity';
import constants from "../../common/constants";

@Injectable()
export class RoleService {
  constructor(
    @Inject(constants.ROLES_REPOSITORY)
    private rolesRepository: typeof Role
  ) {}
  
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create({...createRoleDto});
    return role;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.rolesRepository.findAll();
    return roles;
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findByPk(id);
    return role;
  }

  async getRoleByName(name: string){
    const role = await this.rolesRepository.findOne({where: {name}});
    return role;    
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | [affectedRows: number]> {
    const role = await this.rolesRepository.update(updateRoleDto, {where: {id}});
    return role;
  }

  async delete(id: number): Promise<Role | number> {
    const role = await this.rolesRepository.destroy({where: {id}});
    return role;
  }
}
