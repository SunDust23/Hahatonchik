import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    minLength: 2,
    maxLength: 50,
  })
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    minLength: 2,
    maxLength: 50,
  })
  last_name: string;

  @ApiPropertyOptional({
    description: 'Отчество пользователя (необязательно)',
    example: 'Иванович',
  })
  middle_name?: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'P@ssw0rd!',
    minLength: 6,
  })
  password: string;
}
