import { BaseModel } from '@/models/base/base.model';
import { Music } from '@/models/music.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'picture', type: 'text', nullable: true })
  picture!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string;

  @Column({ default: 0 })
  viewCount!: number;

  @ManyToMany(() => Music, (music) => music.categories)
  musics!: Music[];
}
