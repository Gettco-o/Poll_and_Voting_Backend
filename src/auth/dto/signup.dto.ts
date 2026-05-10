import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
import { NigerianStates } from '../../common/enums/nigerian-states';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'LAGOS' })
  @IsEnum(NigerianStates)
  @IsNotEmpty()
  state!: NigerianStates;

  @ApiProperty({ example: 'ADMIN', required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: 'SECRET_ADMIN_CODE', required: false })
  @IsOptional()
  @IsString()
  adminRegistrationCode?: string;
}
