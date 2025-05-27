import { Artist } from '@/models/artist.model';
import { BaseModel } from '@/models/base/base.model';
import { Listener } from '@/models/listener.model';
import { Index, Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@Index(['artistId', 'listenerId'], { unique: true })
@Entity('artist_followers')
export class ArtistFollower extends BaseModel {
  @Column('bigint', { name: 'artist_id' })
  artistId!: number;

  @Column('bigint', { name: 'listener_id' })
  listenerId!: number;

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @JoinColumn({ name: 'listener_id' })
  @ManyToOne(() => Listener, (listener) => listener.artistFollow)
  listener!: Listener;

  @JoinColumn({ name: 'artist_id' })
  @ManyToOne(() => Artist)
  artist!: Artist;
}
