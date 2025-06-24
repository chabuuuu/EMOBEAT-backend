import { UserSetting } from '@/models/user_setting.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IUserSettingRepository } from '@/repository/interface/i.user_setting.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class UserSettingRepository extends BaseRepository<UserSetting> implements IUserSettingRepository<UserSetting> {
constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
super(dataSource.getRepository(UserSetting));
}
}