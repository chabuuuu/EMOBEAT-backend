import { IsOptional, MaxLength } from 'class-validator';

export class OrchestraUpdateReq {
  @IsOptional()
  @MaxLength(50)
  name!: string;

  @IsOptional()
  picture!: string;

  @IsOptional()
  description!: string;
}
