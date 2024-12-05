import { Injectable } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Includeable, Op } from 'sequelize';
import * as _ from 'lodash';
import { FilterFieldsDto, IncludeCriteriaDto } from './filter.dto';
import { FilterOperator } from '../enums/filter-operator.enum';

@Injectable()
export class FindService {
  constructor() { }

  async findAll(model: ModelCtor<Model<any, any>>, queryParams: any): Promise<{ rows: any[], count: number }> {

    const {
      fields,
      page = 0,
      pageSize = 10000,
      sort = [],
      includes = [],
    } = queryParams;

    const where = this.buildWhere(fields);

    const order = sort.map(s => [s.field, s.order.toUpperCase()]); // Подготовка параметров сортировки
    const offset = page * pageSize;
    const limit = pageSize;
    const include = this.buildInclude(includes);

    return await model.findAndCountAll({
      where,
      order,
      offset,
      limit,
      include
    });
  }

  buildWhere(fields: FilterFieldsDto): any {
    const where = {};
    _.forOwn(fields, (criteria, field) => {
      const { operator, value, range } = criteria;
      switch (operator) {
        case FilterOperator.EQ: where[field] = value; break;
        case FilterOperator.NEQ: where[field] = { [Op.ne]: value }; break;
        case FilterOperator.GTE: where[field] = { [Op.gte]: value }; break;
        case FilterOperator.LTE: where[field] = { [Op.lte]: value }; break;
        case FilterOperator.GT: where[field] = { [Op.gt]: value }; break;
        case FilterOperator.LT: where[field] = { [Op.lt]: value }; break;
        case FilterOperator.CICONT: where[field] = { [Op.iLike]: `%${value}%` }; break;
        case FilterOperator.CONTAINS: where[field] = { [Op.like]: `%${value}%` }; break;
        case FilterOperator.NOT_CONTAINS: where[field] = { [Op.notLike]: `%${value}%` }; break;
        case FilterOperator.IS_EMPTY: where[field] = { [Op.or]: [{ [Op.eq]: '' }, { [Op.is]: null }] }; break;
        case FilterOperator.IS_NOT_EMPTY: where[field] = { [Op.and]: [{ [Op.ne]: '' }, { [Op.not]: null }] }; break;
        case FilterOperator.IN: where[field] = { [Op.in]: Array.isArray(value) ? value : [value] }; break;
        case FilterOperator.NOT_IN: where[field] = { [Op.notIn]: Array.isArray(value) ? value : [value] }; break;
        case FilterOperator.BETWEEN:
          if (Array.isArray(range) && range.length === 2) {
            where[field] = { [Op.between]: range };
          }
          break;
        case FilterOperator.CONTAINS_ANY:
          if (Array.isArray(value)) {
            where[field] = {
              [Op.or]: value.map(v => ({ [Op.iLike]: `%${v}%` }))
            };
          }
          break;
        case FilterOperator.NOT_CONTAINS_ANY:
          if (Array.isArray(value)) {
            where[field] = {
              [Op.and]: value.map(v => ({ [Op.notILike]: `%${v}%` }))
            };
          }
          break;
        // Добавьте дополнительные операции по мере необходимости
      }
    });
    return where;
  }

  buildInclude(includes: IncludeCriteriaDto[]): Includeable[] {
    return includes.map(include => ({
      association: include.association,
      where: this.buildWhere(include.fields),
      required: false
    }));
  }
}
