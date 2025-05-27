import { Music } from '@/models/music.model';

export class ContributorDetailRes {
  id!: number;

  email!: string;

  username!: string;

  fullname!: string;

  points!: number;

  musics!: Music[];

  createAt!: Date;

  updateAt!: Date;
}
