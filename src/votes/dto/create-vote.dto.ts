import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({ description: 'ID of the poll being voted on' })
  @IsInt()
  pollId!: number;

  @ApiProperty({ description: 'ID of the option being voted for' })
  @IsInt()
  optionId!: number;
}
