import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class PeriodCreateReq {
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  picture!: string;
}
