import { IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';

export class LoginAdminReq {
  @IsNotEmpty()
  @MaxLength(70)
  username!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}
