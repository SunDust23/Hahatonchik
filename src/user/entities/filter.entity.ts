import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from './user.entity';


@Table
export class SavedFilter extends Model<SavedFilter> {
  @ForeignKey(() => User)
  @Column({ 
    type: DataType.INTEGER, 
    comment: 'ID пользователя, которому принадлежит фильтр',
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User; // Связь с таблицей пользователей

  @Column({
    type: DataType.STRING,
    comment: 'Название сохраненного фильтра',
  }) 
  name: string;

  @Column({
    type: DataType.STRING,
    comment: 'Название сервиса или таблицы, для которой применяется фильтр',
  })
  service_name: string;

  @Column({
    type: DataType.TEXT,
    comment: 'JSON-строка с фильтрами',
  })
  filters: string;
}