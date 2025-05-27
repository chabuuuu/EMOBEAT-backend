import { LoginAdminReq } from '@/dto/admin/request/login-admin.req';
import { AdminGetMeRes } from '@/dto/admin/response/admin-get-me.res';
import { LoginAdminRes } from '@/dto/admin/response/login-admin.res';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IAdminService<T> extends IBaseCrudService<T> {
  login(loginAdminReq: LoginAdminReq): Promise<LoginAdminRes>;
  getMe(adminId: number): Promise<AdminGetMeRes>;
}
