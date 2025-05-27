import { IsOptional, MaxLength } from 'class-validator';

export class PeriodUpdateReq {
  @IsOptional()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  picture!: string;
}
