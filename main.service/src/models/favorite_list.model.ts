import { BaseModel } from '@/models/base/base.model';
import { Listener } from '@/models/listener.model';
import { Music } from '@/models/music.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('favorite_lists')
export class FavoriteList extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'listener_id' })
  listenerId!: number;

  @Column({ name: 'music_id' })
  musicId!: number;

  @ManyToOne(() => Listener, (listener) => listener.favoriteLists)
  @JoinColumn({ name: 'listener_id' })
  listener!: Listener;

  @ManyToOne(() => Music)
  @JoinColumn({ name: 'music_id' })
  music!: Music;
}
