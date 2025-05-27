import { Album } from '@/models/album.model';
import { Artist } from '@/models/artist.model';
import { Category } from '@/models/category.model';
import { Genre } from '@/models/genre.model';
import { Instrument } from '@/models/instrument.model';
import { Period } from '@/models/period.model';

export class MusicSearchRes {
  id!: number;

  name!: string;

  coverPhoto!: string;

  resourceLink!: string;

  albums!: Album[];

  genres!: Genre[];

  instruments!: Instrument[];

  periods!: Period[];

  categories!: Category[];

  artists!: Artist[];

  composers!: Artist[];

  createAt!: Date;

  updateAt!: Date;
}
