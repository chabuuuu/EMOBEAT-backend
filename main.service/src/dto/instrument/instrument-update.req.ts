import { IsOptional, MaxLength } from 'class-validator';

export class InstrumentUpdateReq {
  @IsOptional()
  @MaxLength(50)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  picture!: string;
}
