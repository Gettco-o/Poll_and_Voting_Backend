import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePollOptionDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  pollId!: number;

  @ApiProperty({
    example: 'Option 1',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  optionText!: string;
}
