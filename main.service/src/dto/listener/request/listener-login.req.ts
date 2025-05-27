import { IsNotEmpty, MaxLength, IsStrongPassword } from 'class-validator';

export class ListnerLoginReq {
  @IsNotEmpty()
  @MaxLength(90)
  usernameOrEmail!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}
