import { UserSettingUpdateReq } from '@/dto/user_setting/request/user-setting-update.req';
import { UserSetting } from '@/models/user_setting.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IUserSettingService<T extends BaseModelType> extends IBaseCrudService<T> {
  updateMyUserSetting(id: number, userSettingUpdateReq: UserSettingUpdateReq): Promise<void>;
  getMyUserSetting(id: number): Promise<Partial<UserSetting>>;
}
