import { Album } from '@/models/album.model';
import { BaseModel } from '@/models/base/base.model';
import { Listener } from '@/models/listener.model';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Index(['albumId', 'listenerId'], { unique: true })
@Entity('listener_album_likes')
export class ListenerAlbumLike extends BaseModel {
  @Column('bigint', { name: 'album_id' })
  albumId!: number;

  @Column('bigint', { name: 'listener_id' })
  listenerId!: number;

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @JoinColumn({ name: 'listener_id' })
  @ManyToOne(() => Listener, (listener) => listener.listenerAlbumLikes)
  listener!: Listener;

  @JoinColumn({ name: 'album_id' })
  @ManyToOne(() => Album)
  album!: Album;
}
