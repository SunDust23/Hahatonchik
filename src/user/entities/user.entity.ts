import { Table, Column, Model, BelongsToMany, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';
import { Role } from '../../role/entities/role.entity';
import { UserRoles } from './user-roles.entity';
import { Sex } from 'src/common/enums/sex.enum';
import { SavedFilter } from './filter.entity';


@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Уникальный идентификатор пользователя',
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Соль для аватара (используется для кэширования)',
  })
  avatar_salt: string;

  @Column({
    type: DataType.STRING,
    comment: 'Имя пользователя',
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    comment: 'Фамилия пользователя',
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    comment: 'Отчество пользователя',
  })
  middle_name: string;

  @Column({
    type: DataType.ENUM(...Object.values(Sex)), // Перечисление из enum
    comment: 'Пол пользователя',
  })
  sex: Sex;

  @Column({
    type: DataType.STRING,
    comment: 'Телефон пользователя',
  })
  phone: string;

  @Column({
    type: DataType.DATE,
    comment: 'Дата рождения пользователя',
  })
  birthdate: Date;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @Column({
    type: DataType.STRING,
    unique: true,
    comment: 'Электронная почта пользователя',
  })
  email: string;

  @Column({
    type: DataType.STRING,
    comment: 'Хэш пароля пользователя',
  })
  password: string;

  @HasMany(() => SavedFilter)
  savedFilters: SavedFilter[]; // Связь с сохраненными фильтрами
}