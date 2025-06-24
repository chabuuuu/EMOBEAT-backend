import { Listener } from '@/models/listener.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_settings')
export class UserSetting {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'listener_id', type: 'bigint' })
  listenerId!: number;

  @JoinColumn({ name: 'listener_id' })
  @OneToOne(() => Listener, (listener) => listener.userSetting)
  listener!: Listener;

  @Column({ name: 'is_allow_recommend', type: 'boolean', default: true })
  isAllowRecommend!: boolean;

  @Column({ name: 'recommend_interval', type: 'int', default: 10 })
  recommendInterval!: number;

  @Column({ name: 'detect_interval', type: 'int', default: 10 })
  detectInterval!: number;
}
