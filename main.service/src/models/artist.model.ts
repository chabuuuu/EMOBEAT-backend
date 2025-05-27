import { ArtistStudent } from '@/models/artist_student.model';
import { BaseModel } from '@/models/base/base.model';
import { Genre } from '@/models/genre.model';
import { Instrument } from '@/models/instrument.model';
import { Music } from '@/models/music.model';
import { Orchestra } from '@/models/orchestra.model';
import { Period } from '@/models/period.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm';

@Entity('artists')
export class Artist extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 30 })
  name!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column('text', { nullable: true })
  picture!: string;

  @Column('text', { nullable: true, name: 'awards_and_honors' })
  awardsAndHonors?: string;

  @Column({ length: 50, nullable: true })
  nationality?: string;

  @Column({ length: 150, nullable: true, name: 'teaching_and_academic_contributions' })
  teachingAndAcademicContributions!: string;

  @Column('text', { nullable: true, name: 'significant_performences' })
  significantPerformences!: string;

  @Column('text', { array: true, nullable: true })
  roles!: string[];

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth?: Date;

  @Column({ type: 'date', nullable: true, name: 'date_of_death' })
  dateOfDeath?: Date;

  @OneToMany(() => ArtistStudent, (artistStudent) => artistStudent.student, { cascade: true })
  artistStudents!: ArtistStudent[];

  @OneToMany(() => ArtistStudent, (artistStudent) => artistStudent.teacher, { cascade: true })
  artistTeachers!: ArtistStudent[];

  @ManyToMany(() => Music, (music) => music.artists)
  @JoinTable({
    name: 'music_artists',
    joinColumn: { name: 'artist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'music_id', referencedColumnName: 'id' }
  })
  musics!: Music[];

  @ManyToMany(() => Music, (music) => music.composers)
  musicsComposed!: Music[];

  @ManyToMany(() => Period)
  @JoinTable({
    name: 'artist_periods',
    joinColumn: { name: 'artist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'period_id', referencedColumnName: 'id' }
  })
  periods!: Period[];

  @ManyToMany(() => Orchestra, (orchestra) => orchestra.artists)
  @JoinTable({
    name: 'orchestra_artists',
    joinColumn: { name: 'artist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'orchestra_id', referencedColumnName: 'id' }
  })
  orchestras!: Orchestra[];

  @ManyToMany(() => Genre, (genre) => genre.artists)
  @JoinTable({
    name: 'genre_artists',
    joinColumn: { name: 'artist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' }
  })
  genres!: Genre[];

  @ManyToMany(() => Instrument, (instrument) => instrument.artists)
  @JoinTable({
    name: 'instrument_artists',
    joinColumn: { name: 'artist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'instrument_id', referencedColumnName: 'id' }
  })
  instruments!: Instrument[];

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: 0 })
  followers!: number;
}
