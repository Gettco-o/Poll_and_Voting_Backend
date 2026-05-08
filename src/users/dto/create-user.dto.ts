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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(NigerianStates)
  state!: NigerianStates;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
