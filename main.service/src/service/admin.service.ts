import { LoginAdminReq } from '@/dto/admin/request/login-admin.req';
import { AdminGetMeRes } from '@/dto/admin/response/admin-get-me.res';
import { LoginAdminRes } from '@/dto/admin/response/login-admin.res';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { AdminLoginException } from '@/exceptions/admin/admin-login.exception';
import { Admin } from '@/models/admin.model';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IAdminService } from '@/service/interface/i.admin.service';
import DefinedError from '@/utils/error/defined.error';
import { generateAccessToken } from '@/utils/security/generate-access-token.util';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';

@injectable()
export class AdminService extends BaseCrudService<Admin> implements IAdminService<Admin> {
  private adminRepository: IAdminRepository<Admin>;

  constructor(@inject('AdminRepository') adminRepository: IAdminRepository<Admin>) {
    super(adminRepository);
    this.adminRepository = adminRepository;
  }

  async login(loginAdminReq: LoginAdminReq): Promise<LoginAdminRes> {
    const admin = await this.adminRepository.findOne({
      filter: {
        username: loginAdminReq.username
      }
    });
    if (!admin) {
      throw new DefinedError(AdminLoginException.ADMIN_LOGIN_NotFound);
    }

    // Compare password
    if (!bcrypt.compareSync(loginAdminReq.password, admin.password)) {
      throw new DefinedError(AdminLoginException.ADMIN_LOGIN_WrongPasswordOrUsername);
    }

    // Generate token
    const accessToken = await generateAccessToken(admin.id, admin.username, RoleCodeEnum.ADMIN);

    // Return response
    return {
      accessToken: accessToken,
      id: Number(admin.id)
    };
  }

  async getMe(adminId: number): Promise<AdminGetMeRes> {
    const admin = await this.adminRepository.findOne({
      filter: {
        id: adminId
      }
    });
    if (!admin) {
      throw new DefinedError(AdminLoginException.ADMIN_LOGIN_WrongPasswordOrUsername);
    }

    return {
      id: admin.id,
      name: admin.name,
      picture: admin.picture,
      username: admin.username
    };
  }
}
