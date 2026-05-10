import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateVoteDto {
  @ApiProperty({ description: 'ID of the new poll option', required: false })
  @IsInt()
  optionId!: number;
}
