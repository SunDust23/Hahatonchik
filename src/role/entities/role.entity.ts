import { Table, Column, Model, BelongsToMany, DataType } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { UserRoles } from '../../user/entities/user-roles.entity';

@Table
export class Role extends Model {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column
  name: string;

  @Column
  description?: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[]
}