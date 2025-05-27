import { IsNotEmpty, IsEmail, MaxLength, IsStrongPassword } from 'class-validator';

export class ContributorUpdateReq {
  @IsNotEmpty()
  @MaxLength(50)
  fullname!: string;
}
