import { Album } from '@/models/album.model';
import { Artist } from '@/models/artist.model';
import { BaseModel } from '@/models/base/base.model';
import { Category } from '@/models/category.model';
import { Genre } from '@/models/genre.model';
import { Instrument } from '@/models/instrument.model';
import { Period } from '@/models/period.model';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mucis')
export class Music extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  slug!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column('text', { nullable: true })
  lyric!: string;

  @Column({ length: 50, nullable: true })
  nationality?: string;

  @Column('text', { nullable: true, name: 'cover_photo' })
  coverPhoto!: string;

  @Column({ name: 'resource_link' })
  resourceLink!: string;

  @Column({ nullable: true })
  releaseYear!: number;

  @Column({ name: 'media_id', length: 250, nullable: true })
  mediaId?: string;

  @ManyToMany(() => Album, (album) => album.musics)
  @JoinTable({
    name: 'music_albums',
    joinColumn: { name: 'music_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'album_id', referencedColumnName: 'id' }
  })
  albums!: Album[];

  @ManyToMany(() => Genre, (genre) => genre.musics)
  @JoinTable({
    name: 'music_genres',
    joinColumn: { name: 'music_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' }
  })
  genres!: Genre[];

  @ManyToMany(() => Instrument, (instrument) => instrument.musics)
  @JoinTable({
    name: 'music_instruments',
    joinColumn: { name: 'music_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'instrument_id', referencedColumnName: 'id' }
  })
  instruments!: Instrument[];

  @ManyToMany(() => Period, (period) => period.musics)
  @JoinTable({
    name: 'music_periods',
    joinColumn: { name: 'music_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'period_id', referencedColumnName: 'id' }
  })
  periods!: Period[];

  @ManyToMany(() => Category, (category) => category.musics)
  @JoinTable({
    name: 'music_categories',
    joinColumn: { name: 'music_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories!: Category[];

  @ManyToMany(() => Artist, (artist) => artist.musics)
  artists!: Artist[];

  @ManyToMany(() => Artist, (artist) => artist.musicsComposed)
  @JoinTable({
    name: 'music_composers',
    joinColumn: { name: 'music_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' }
  })
  composers!: Artist[];

  @Column({ default: 0 })
  listenCount!: number;

  @Column({ default: 0 })
  favoriteCount!: number;

  @Column({ name: 'emotion', nullable: false, default: 0 })
  emotion!: number;
}
