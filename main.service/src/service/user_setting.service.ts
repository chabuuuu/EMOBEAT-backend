import { UserSettingUpdateReq } from '@/dto/user_setting/request/user-setting-update.req';
import { UserSetting } from '@/models/user_setting.model';
import { IUserSettingRepository } from '@/repository/interface/i.user_setting.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IUserSettingService } from '@/service/interface/i.user_setting.service';
import { inject, injectable } from 'inversify';

@injectable()
export class UserSettingService extends BaseCrudService<UserSetting> implements IUserSettingService<UserSetting> {
  private userSettingRepository: IUserSettingRepository<UserSetting>;

  constructor(@inject('UserSettingRepository') userSettingRepository: IUserSettingRepository<UserSetting>) {
    super(userSettingRepository);
    this.userSettingRepository = userSettingRepository;
  }

  async updateMyUserSetting(id: number, userSettingUpdateReq: UserSettingUpdateReq): Promise<void> {
    // Check if the user setting exists
    const userSetting = await this.userSettingRepository.findOne({
      filter: {
        listenerId: id
      }
    });

    if (!userSetting) {
      // If not exists, create a new user setting
      await this.userSettingRepository.create({
        data: {
          listenerId: id,
          isAllowRecommend: userSettingUpdateReq.isAllowRecommend ?? true,
          recommendInterval: userSettingUpdateReq.recommendInterval ?? 10,
          detectInterval: userSettingUpdateReq.detectInterval ?? 10
        }
      });
      return;
    }

    // If exists, update the user setting
    await this.userSettingRepository.findOneAndUpdate({
      filter: {
        listenerId: id
      },
      updateData: {
        isAllowRecommend: userSettingUpdateReq.isAllowRecommend ?? userSetting.isAllowRecommend,
        recommendInterval: userSettingUpdateReq.recommendInterval ?? userSetting.recommendInterval,
        detectInterval: userSettingUpdateReq.detectInterval ?? userSetting.detectInterval
      }
    });
  }

  async getMyUserSetting(userId: number): Promise<Partial<UserSetting>> {
    const userSetting = await this.userSettingRepository.findOne({
      filter: {
        listenerId: userId
      }
    });

    if (!userSetting) {
      return {
        isAllowRecommend: true,
        recommendInterval: 10,
        detectInterval: 10
      };
    }

    return {
      isAllowRecommend: userSetting.isAllowRecommend,
      recommendInterval: userSetting.recommendInterval,
      detectInterval: userSetting.detectInterval
    };
  }
}
