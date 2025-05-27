import { FavoriteList } from '@/models/favorite_list.model';

export class ListenerDetailRes {
  id!: number;

  email!: string;

  username!: string;

  fullname!: string;

  gender!: string;

  createAt!: Date;

  updateAt!: Date;

  favoriteLists!: FavoriteList[];
}
