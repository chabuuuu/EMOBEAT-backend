import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['userId', 'emotion', 'musicId'], { unique: true })
@Entity({ name: 'emotion_collects' })
export class EmotionCollect {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'user_id', type: 'bigint', nullable: false })
  userId!: number;

  @Column({ name: 'music_id', type: 'bigint', nullable: false })
  musicId!: number;

  @Column({ name: 'emotion', nullable: false })
  emotion!: number;

  @Column({ name: 'score', type: 'float', default: 0, nullable: false })
  score!: number;
}
