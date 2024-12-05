import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export default class DefineUserRoleDto {
  @ApiProperty()
  role_id: number;
  @ApiProperty()
  user_id: number;
}