import { Artist } from '@/models/artist.model';
import { BaseModel } from '@/models/base/base.model';
import { Music } from '@/models/music.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('periods')
export class Period extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column('text')
  picture!: string;

  @ManyToMany(() => Music, (music) => music.periods)
  musics!: Music[];

  @ManyToMany(() => Artist, (artist) => artist.periods)
  artists!: Artist[];
}
