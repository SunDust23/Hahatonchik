import { ApiProperty } from '@nestjs/swagger';

export default class DefineUserRoleDto {
  @ApiProperty({
    description: 'Идентификатор роли, которую нужно назначить пользователю',
    example: 1,
  })
  role_id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя, которому нужно назначить роль',
    example: 42,
  })
  user_id: number;
}