import { ArtistFollower } from '@/models/artist_follower.model';
import { BaseModel } from '@/models/base/base.model';
import { FavoriteList } from '@/models/favorite_list.model';
import { ListenerAlbumLike } from '@/models/listener_album_like.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'listeners' })
export class Listener extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ name: 'username', type: 'varchar', length: 70 })
  username!: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password!: string;

  @Column({ name: 'fullname', type: 'varchar', length: 50 })
  fullname!: string;

  @Column({ name: 'gender', type: 'varchar', nullable: true, length: 10 })
  gender!: string;

  @Column({ length: 50, nullable: true })
  nationality?: string;

  @Column({ name: 'points', type: 'int', default: 0 })
  points!: number;

  @Column({ name: 'premium_expired_at', type: 'timestamp', nullable: true })
  premiumExpiredAt?: Date;

  @OneToMany(() => FavoriteList, (favoriteList) => favoriteList.listener, {
    cascade: true
  })
  favoriteLists!: FavoriteList[];

  @OneToMany(() => ArtistFollower, (artistFollower) => artistFollower.listener)
  artistFollow!: ArtistFollower[];

  @OneToMany(() => ListenerAlbumLike, (listenerAlbumLike) => listenerAlbumLike.listener)
  listenerAlbumLikes!: ListenerAlbumLike[];
}
