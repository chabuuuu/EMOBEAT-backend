import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class OrchestraCreateReq {
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @IsOptional()
  picture!: string;

  @IsOptional()
  description!: string;
}
