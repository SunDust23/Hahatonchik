import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { User } from './user.entity';


@Table
export class SavedFilter extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  user_id: number;

  @Column({ type: DataType.STRING })
  name: string; // Название сохраненного фильтра

  @Column({ type: DataType.TEXT })
  filters: string; // JSON-строка с фильтрами
}
