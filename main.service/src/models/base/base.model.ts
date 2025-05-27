import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel {
  @CreateDateColumn({ name: 'create_at' })
  createAt!: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt!: Date;

  @Column({ nullable: true, name: 'delete_at' })
  deleteAt!: Date;
}
