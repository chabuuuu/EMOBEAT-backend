import { IsNotEmpty, MaxLength, IsStrongPassword } from 'class-validator';

export class ContributorLoginReq {
  @IsNotEmpty()
  @MaxLength(90)
  usernameOrEmail!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}
