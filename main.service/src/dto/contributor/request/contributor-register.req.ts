import { IsNotEmpty, IsEmail, MaxLength, IsStrongPassword } from 'class-validator';

export class ContributorRegisterReq {
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
}
