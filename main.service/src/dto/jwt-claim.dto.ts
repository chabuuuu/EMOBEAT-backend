import { RoleCodeEnum } from '@/enums/role-code.enum';

export class JwtClaimDto {
  id!: number;
  username!: string;
  role!: RoleCodeEnum;

  constructor(id: number, username: string, role: RoleCodeEnum) {
    this.id = id;
    this.username = username;
    this.role = role;
  }
}
