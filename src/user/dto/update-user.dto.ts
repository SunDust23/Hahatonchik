import { PartialType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export default class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  id?: number;

  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  first_name?: string;

  @ApiPropertyOptional({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Отчество пользователя (необязательно)',
    example: 'Иванович',
  })
  middle_name?: string;

  @ApiPropertyOptional({
    description: 'Дата рождения пользователя',
    example: '1990-01-01',
    type: 'string',
    format: 'date',
  })
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'Телефон пользователя',
    example: '+79998887766',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Соль для аватара (используется для кэширования изображений)',
    example: 'a1b2c3d4',
  })
  avatar_salt?: string;
}
