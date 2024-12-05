import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, ValidateNested, IsString, IsArray } from 'class-validator';

class FilterCriteriaDto {
  @IsOptional()
  operator: string;

  @IsOptional()
  value: any;

  @IsOptional()
  @IsArray()
  range?: [any, any]; // Массив для хранения начальной и конечной даты
}

export class IncludeCriteriaDto {
  @IsString()
  association: string; // Название связи, например, 'profile' или 'organization'

  @ValidateNested()
  @Type(() => FilterFieldsDto)
  fields: FilterFieldsDto; // Поля для фильтрации внутри связи
}

class SortCriteria {
    @IsString()
    field: string;
  
    @IsString()
    order: string;
  }

  export class FilterFieldsDto {
  [key: string]: FilterCriteriaDto;
}

export class FilterDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldsDto)
  fields: FilterFieldsDto;

  @IsInt()
  @Min(0)
  page: number;

  @IsInt()
  @Min(1)
  pageSize: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortCriteria)
  sort: SortCriteria[];

  @IsOptional()
  sortOrder: string;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncludeCriteriaDto)
  includes: IncludeCriteriaDto[]; // Добавляем новое поле для вложенных фильтраций
}
