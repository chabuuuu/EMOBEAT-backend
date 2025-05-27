import { BaseModel } from '@/models/base/base.model';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admins' })
export class Admin extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ length: 30 })
  name!: string;

  @Column('text', { nullable: true })
  picture!: string;

  @Column({ name: 'username', type: 'varchar', length: 70 })
  username!: string;

  @Column({ name: 'password', type: 'varchar', length: 100, nullable: true })
  password!: string;
}
