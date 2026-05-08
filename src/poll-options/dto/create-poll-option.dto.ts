import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePollOptionDto {
  @IsInt()
  pollId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  optionText!: string;
}
