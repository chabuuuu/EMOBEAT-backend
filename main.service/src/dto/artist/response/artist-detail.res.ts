import { Genre } from '@/models/genre.model';
import { Instrument } from '@/models/instrument.model';
import { Orchestra } from '@/models/orchestra.model';

export class ArtistDetailRes {
  id!: number;
  name!: string;
  description!: string;
  picture!: string;
  awardsAndHonors!: string;
  nationality!: string;
  teachingAndAcademicContributions!: string;
  significantPerformences!: string;
  roles!: string[];
  dateOfBirth!: Date;
  dateOfDeath!: Date | null;
  genres!: Genre[];
  orchestras!: Orchestra[];
  artistStudents!: {
    student: {
      id: number;
      name: string;
      description: string;
      picture: string;
    };
  }[];
  instruments!: Instrument[];
  musics!: {
    id: number;
    name: string;
    coverPhoto: string;
  }[];
  musicsComposed!: {
    id: number;
    name: string;
    coverPhoto: string;
  }[];
}
