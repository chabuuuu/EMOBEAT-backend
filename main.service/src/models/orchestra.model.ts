import { Artist } from '@/models/artist.model';
import { BaseModel } from '@/models/base/base.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'orchestras' })
export class Orchestra extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'picture', type: 'text', nullable: true })
  picture!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string;

  @ManyToMany(() => Artist, (artist) => artist.orchestras)
  artists!: Artist[];
}
