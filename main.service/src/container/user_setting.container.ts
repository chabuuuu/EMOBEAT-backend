import { UserSettingController } from '@/controller/user_setting.controller';
import { UserSettingService } from '@/service/user_setting.service';
import { UserSetting } from '@/models/user_setting.model';
import { UserSettingRepository } from '@/repository/user_setting.repository';
import { IUserSettingService } from '@/service/interface/i.user_setting.service';
import { IUserSettingRepository } from '@/repository/interface/i.user_setting.repository';
import { BaseContainer } from '@/container/base.container';

class UserSettingContainer extends BaseContainer {
  constructor() {
    super(UserSetting);
this.container.bind<IUserSettingService<UserSetting>>('UserSettingService').to(UserSettingService);
this.container.bind<IUserSettingRepository<UserSetting>>('UserSettingRepository').to(UserSettingRepository);
this.container.bind<UserSettingController>(UserSettingController).toSelf();
}

export() {
    const userSettingController = this.container.get<UserSettingController>(UserSettingController);
    const userSettingService = this.container.get<IUserSettingService<any>>('UserSettingService');
    const userSettingRepository = this.container.get<IUserSettingRepository<any>>('UserSettingRepository');

return { userSettingController, userSettingService, userSettingRepository };
}
}

const userSettingContainer = new UserSettingContainer();
const { userSettingController, userSettingService,userSettingRepository } = userSettingContainer.export();
export { userSettingController, userSettingService, userSettingRepository };