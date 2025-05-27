import { FavoriteList } from '@/models/favorite_list.model';

export class ListnerGetMeRes {
  id!: number;

  email!: string;

  username!: string;

  fullname!: string;

  gender!: string;

  points!: number;

  premiumExpiredAt?: Date;

  favoriteLists!: FavoriteList[];

  createAt!: Date;

  updateAt!: Date;
}
