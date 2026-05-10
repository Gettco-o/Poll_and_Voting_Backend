import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { NigerianStates } from '../../common/enums/nigerian-states';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: NigerianStates, example: 'LAGOS',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(NigerianStates)
  state!: NigerianStates;

  @ApiProperty({
    example: 'ADMIN', required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
