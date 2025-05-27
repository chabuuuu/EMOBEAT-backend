import { Album } from '@/models/album.model';
import { Artist } from '@/models/artist.model';
import { BaseModel } from '@/models/base/base.model';
import { Music } from '@/models/music.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('genres')
export class Genre extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column('text', { nullable: true })
  picture!: string;

  @ManyToMany(() => Album, (album) => album.genres)
  albums!: Album[];

  @ManyToMany(() => Music, (music) => music.genres)
  musics!: Music[];

  @ManyToMany(() => Artist, (artist) => artist.genres)
  artists!: Artist[];
}
