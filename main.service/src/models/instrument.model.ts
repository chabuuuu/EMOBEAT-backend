import { Artist } from '@/models/artist.model';
import { BaseModel } from '@/models/base/base.model';
import { Music } from '@/models/music.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('instruments')
export class Instrument extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column('text', { nullable: true })
  picture!: string;

  @ManyToMany(() => Music, (music) => music.instruments)
  musics!: Music[];

  @ManyToMany(() => Artist, (artist) => artist.instruments)
  artists!: Artist[];
}
