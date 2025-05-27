import { IsOptional, MaxLength } from 'class-validator';

export class ArtistUpdateReq {
  @IsOptional()
  @MaxLength(30)
  name?: string;

  @IsOptional()
  description?: string | null;

  @IsOptional()
  picture?: string | null;

  @IsOptional()
  awardsAndHonors?: string;

  @IsOptional()
  nationality?: string;

  @IsOptional()
  teachingAndAcademicContributions?: string | null;

  @IsOptional()
  significantPerformences?: string | null;

  @IsOptional()
  roles?: string[];

  @IsOptional()
  dateOfBirth?: Date | null;

  @IsOptional()
  dateOfDeath?: Date | null;

  @IsOptional()
  artistStudentIds?: number[];

  @IsOptional()
  @IsOptional()
  periodIds?: number[];

  @IsOptional()
  orchestraIds?: number[];

  @IsOptional()
  genreIds?: number[];

  @IsOptional()
  instrumentIds?: number[];
}
