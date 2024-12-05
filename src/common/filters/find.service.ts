import { Injectable } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Includeable, Op } from 'sequelize';
import * as _ from 'lodash';
import { FilterFieldsDto, IncludeCriteriaDto } from './filter.dto';

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
        case 'eq': where[field] = value; break;
        case 'neq': where[field] = { [Op.ne]: value }; break;
        case 'gte': where[field] = { [Op.gte]: value }; break;
        case 'lte': where[field] = { [Op.lte]: value }; break;
        case 'gt': where[field] = { [Op.gt]: value }; break;
        case 'lt': where[field] = { [Op.lt]: value }; break;
        case 'cicontains': where[field] = { [Op.iLike]: `%${value}%` }; break;
        case 'contains': where[field] = { [Op.like]: `%${value}%` }; break;
        case 'notContains': where[field] = { [Op.notLike]: `%${value}%` }; break;
        case 'isEmpty': where[field] = { [Op.or]: [{ [Op.eq]: '' }, { [Op.is]: null }] }; break;
        case 'isNotEmpty': where[field] = { [Op.and]: [{ [Op.ne]: '' }, { [Op.not]: null }] }; break;
        case 'in': where[field] = { [Op.in]: Array.isArray(value) ? value : [value] }; break;
        case 'notIn': where[field] = { [Op.notIn]: Array.isArray(value) ? value : [value] }; break;
        case 'between':
          if (Array.isArray(range) && range.length === 2) {
            where[field] = { [Op.between]: range };
          }
          break;
        case 'containsAny':
          if (Array.isArray(value)) {
            where[field] = {
              [Op.or]: value.map(v => ({ [Op.iLike]: `%${v}%` }))
            };
          }
          break;
        case 'notContainsAny':
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
