import { GenderEnum } from '@/enums/gender.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';

export class ListenerResgisterReq {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MaxLength(70)
  username!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @MaxLength(50)
  fullname!: string;

  @IsEnum(GenderEnum)
  gender!: string;
}
