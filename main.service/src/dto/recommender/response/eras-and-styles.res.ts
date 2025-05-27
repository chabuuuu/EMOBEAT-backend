import { Music } from '@/models/music.model';

export class ErasAndStylesRes {
  period!: {
    id: number;
    name: string;
    musics: Music[];
  };
}
