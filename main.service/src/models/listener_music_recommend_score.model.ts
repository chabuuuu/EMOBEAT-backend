import { BaseModel } from '@/models/base/base.model';
import { Listener } from '@/models/listener.model';
import { Music } from '@/models/music.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'listener_music_recommend_score' })
export class ListenerMusicRecommendScore extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'listener_id', type: 'bigint' })
  listenerId!: number;

  @Column({ name: 'music_id', type: 'bigint' })
  musicId!: number;

  @Column({ name: 'score', type: 'float', nullable: false, default: 0 })
  score!: number;

  @ManyToOne(() => Listener, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listener_id' })
  listener!: Listener;

  @ManyToOne(() => Music, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'music_id' })
  music!: Music;
}
