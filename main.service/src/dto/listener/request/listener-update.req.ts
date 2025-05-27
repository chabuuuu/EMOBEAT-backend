import { GenderEnum } from '@/enums/gender.enum';
import { Expose } from 'class-transformer';
import { IsNotEmpty, MaxLength, IsEnum, IsOptional } from 'class-validator';

export class ListenerUpdateReq {
  @Expose()
  @IsOptional()
  @MaxLength(50)
  fullname?: string;

  @Expose()
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: string;
}
