import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreateRoleDto {
  @ApiProperty({
    description: 'Название роли',
    example: 'Администратор',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Описание роли',
    example: 'Роль с максимальными правами для управления системой',
  })
  description?: string;
}
