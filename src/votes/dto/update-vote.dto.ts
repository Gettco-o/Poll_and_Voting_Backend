import { IsInt } from 'class-validator';

export class UpdateVoteDto {
  @IsInt()
  optionId!: number;
}
