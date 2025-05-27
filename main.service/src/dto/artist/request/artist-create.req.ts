import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ArtistCreateReq {
  @IsNotEmpty()
  @MaxLength(30)
  name!: string;

  @IsOptional()
  description!: string | null;

  @IsOptional()
  picture!: string | null;

  @IsOptional()
  awardsAndHonors?: string;

  @IsOptional()
  nationality?: string;

  @IsOptional()
  teachingAndAcademicContributions!: string | null;

  @IsOptional()
  significantPerformences!: string | null;

  @IsNotEmpty()
  roles!: string[];

  @IsOptional()
  dateOfBirth?: Date | null;

  @IsOptional()
  dateOfDeath?: Date | null;

  @IsNotEmpty()
  artistStudentIds!: number[];

  @IsNotEmpty()
  @IsNotEmpty()
  periodIds!: number[];

  @IsNotEmpty()
  orchestraIds!: number[];

  @IsNotEmpty()
  genreIds!: number[];

  @IsNotEmpty()
  instrumentIds!: number[];
}
