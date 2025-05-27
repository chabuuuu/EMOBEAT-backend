import { Admin } from '@/models/admin.model';
import { BaseModel } from '@/models/base/base.model';
import { Genre } from '@/models/genre.model';
import { Music } from '@/models/music.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';

@Entity('albums')
export class Album extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: number;

  @Column('varchar', { name: 'name', length: 50 })
  name!: string;

  @Column('text', { name: 'cover_photo', nullable: true })
  coverPhoto!: string | null;

  @Column('timestamp', { name: 'release_date' })
  releaseDate!: Date;

  @Column('varchar', { name: 'album_type', length: 50, nullable: true })
  albumType!: string | null;

  @Column('text', { name: 'description', nullable: true })
  description!: string | null;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'created_by' })
  createdBy!: Admin;

  @ManyToMany(() => Genre, (genre) => genre.albums, { cascade: true })
  @JoinTable({
    name: 'album_genres',
    joinColumn: { name: 'album_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' }
  })
  genres!: Genre[];

  @ManyToMany(() => Music, (music) => music.albums, { cascade: true })
  musics!: Music[];

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: 0 })
  likeCount!: number;
}
