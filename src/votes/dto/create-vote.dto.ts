import { IsInt } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  pollId!: number;

  @IsInt()
  optionId!: number;
}
