import { Music } from '@/models/music.model';

export class InstrumentSpotlightRes {
  instrument!: {
    id: number;
    name: string;
    musics: Music[];
  };
}
