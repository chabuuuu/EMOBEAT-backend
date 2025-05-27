import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class InstrumentCreateReq {
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  picture!: string;
}
