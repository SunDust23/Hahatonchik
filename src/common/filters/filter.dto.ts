import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, ValidateNested, IsString, IsArray, IsEnum } from 'class-validator';
import { FilterOperator } from '../enums/filter-operator.enum';

class FilterCriteriaDto {
  @ApiPropertyOptional({
    description: 'Оператор фильтрации (например: =, <>, IN)',
    example: 'eq',
    enum: FilterOperator,
  })
  @IsEnum(FilterOperator)
  @IsOptional()
  operator: string;

  @ApiPropertyOptional({
    description: 'Значение фильтрации',
    example: 'John Doe',
  })
  @IsOptional()
  value: any;

  @ApiPropertyOptional({
    description: 'Диапазон значений для дат',
    example: ['2023-01-01', '2023-12-31'],
    type: [String], // Указываем тип массива
  })
  @IsOptional()
  @IsArray()
  range?: [any, any]; // Массив для хранения начальной и конечной даты
}

export class IncludeCriteriaDto {
  @ApiProperty({
    description: 'Название связи (например: profile, organization)',
    example: 'profile',
  })
  @IsString()
  association: string; // Название связи, например, 'profile' или 'organization'

  @ApiProperty({
    description: 'Поля для фильтрации внутри связи',
    type: Object, // Указываем тип как объект
  })
  @ValidateNested()
  @Type(() => FilterFieldsDto)
  fields: FilterFieldsDto; // Поля для фильтрации внутри связи
}

class SortCriteria {
  @ApiProperty({
    description: 'Поле, по которому нужно выполнить сортировку',
    example: 'name',
  })
  @IsString()
  field: string;
  
  @ApiProperty({
    description: 'Порядок сортировки (ASC или DESC)',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsEnum(['ASC', 'DESC'])
  @IsString()
  order: string;
}

export class FilterFieldsDto {
  // @ApiProperty({
  //   description: 'Ключ-значение полей для фильтрации',
  //   example: {
  //     name: {
  //       operator: 'eq',
  //       value: 'John',
  //     },
  //   },
  //   type: Object,
  // })
  [key: string]: FilterCriteriaDto;
}

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Поля для фильтрации',
    type: FilterFieldsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldsDto)
  fields?: FilterFieldsDto;

  @ApiProperty({
    description: 'Номер страницы для пагинации',
    example: 1,
  })
  @IsInt()
  @Min(0)
  page: number;

  @ApiProperty({
    description: 'Количество записей на странице',
    example: 10,
  })
  @IsInt()
  @Min(1)
  pageSize: number;

  @ApiPropertyOptional({
    description: 'Массив критериев сортировки',
    type: [SortCriteria],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortCriteria)
  sort?: SortCriteria[];

  @ApiPropertyOptional({
    description: 'Общий порядок сортировки (ASC или DESC)',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: string;

  @ApiPropertyOptional({
    description: 'Вложенные связи и их фильтрация',
    type: [IncludeCriteriaDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncludeCriteriaDto)
  includes: IncludeCriteriaDto[]; // Добавляем новое поле для вложенных фильтраций
}
