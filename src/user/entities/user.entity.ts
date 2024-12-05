import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';
import { Role } from '../../role/entities/role.entity';
import { UserRoles } from './user-roles.entity';
import { Sex } from 'src/common/enums/sex.enum';



@Table
export class User extends Model {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column
  avatar_salt: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  middle_name: string;

  @Column
  sex: Sex;

  @Column
  phone: string;

  @Column
  birthdate: Date;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @Column
  email: string;

  @Column
  password: string;

  
}

