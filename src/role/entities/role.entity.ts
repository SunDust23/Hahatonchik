import { Table, Column, Model, BelongsToMany, DataType } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { UserRoles } from '../../user/entities/user-roles.entity';

@Table
export class Role extends Model<Role> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Уникальный идентификатор роли',
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    comment: 'Название роли',
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Описание роли',
  })
  description?: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}