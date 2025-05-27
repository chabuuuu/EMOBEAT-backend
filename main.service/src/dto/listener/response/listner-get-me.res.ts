import { FavoriteList } from '@/models/favorite_list.model';

export class ListnerGetMeRes {
  id!: number;

  email!: string;

  username!: string;

  fullname!: string;

  gender!: string;

  birthdate!: Date;

  nationality!: string;

  favoriteLists!: FavoriteList[];

  createAt!: Date;

  updateAt!: Date;
}
