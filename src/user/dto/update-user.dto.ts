import { PartialType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'



export default class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
  @ApiPropertyOptional()
  first_name?: string;
  @ApiPropertyOptional()
  last_name?: string;
  @ApiPropertyOptional()
  middle_name?: string;
  @ApiPropertyOptional()
  birthdate?: Date;
  @ApiPropertyOptional()
  phone?: string;
  @ApiPropertyOptional()
  avatar_salt: string;
}