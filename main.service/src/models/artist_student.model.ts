import { Artist } from '@/models/artist.model';
import { BaseModel } from '@/models/base/base.model';
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

@Index(['teacherId', 'studentId'], { unique: true })
@Entity('artist_students')
export class ArtistStudent extends BaseModel {
  @Column('bigint', { name: 'teacher_id' })
  teacherId!: number;

  @Column('bigint', { name: 'student_id' })
  studentId!: number;

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @JoinColumn({ name: 'student_id' })
  @ManyToOne(() => Artist, (artist) => artist.artistStudents)
  student!: Artist;

  @JoinColumn({ name: 'teacher_id' })
  @ManyToOne(() => Artist, (artist) => artist.artistTeachers)
  teacher!: Artist;
}
