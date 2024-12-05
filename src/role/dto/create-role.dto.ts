import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export default class CreateRoleDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  description?: string;
}
