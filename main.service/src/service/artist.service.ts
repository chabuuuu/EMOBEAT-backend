import { ArtistCreateReq } from '@/dto/artist/request/artist-create.req';
import { ArtistUpdateReq } from '@/dto/artist/request/artist-update.req';
import { ArtistDetailRes } from '@/dto/artist/response/artist-detail.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { ArtistUpdateException } from '@/exceptions/artist/artist-update.exception';
import { Artist } from '@/models/artist.model';
import { ArtistStudent } from '@/models/artist_student.model';
import { Genre } from '@/models/genre.model';
import { Instrument } from '@/models/instrument.model';
import { Music } from '@/models/music.model';
import { Orchestra } from '@/models/orchestra.model';
import { Period } from '@/models/period.model';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { IArtistStudentRepository } from '@/repository/interface/i.artist_student.repository';
import { IGenreRepository } from '@/repository/interface/i.genre.repository';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { IOrchestraRepository } from '@/repository/interface/i.orchestra.repository';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IArtistService } from '@/service/interface/i.artist.service';
import DefinedError from '@/utils/error/defined.error';
import { SearchUtil } from '@/utils/search/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class ArtistService extends BaseCrudService<Artist> implements IArtistService<Artist> {
  private artistRepository: IArtistRepository<Artist>;
  private musicRepository: IMusicRepository<Music>;
  private genreRepository: IGenreRepository<Genre>;
  private orchestraRepository: IOrchestraRepository<Orchestra>;
  private periodRepository: IPeriodRepository<Period>;
  private instrumentRepository: IInstrumentRepository<Instrument>;
  private artistStudentRepository: IArtistStudentRepository<ArtistStudent>;

  constructor(
    @inject('ArtistRepository') artistRepository: IArtistRepository<Artist>,
    @inject('MusicRepository') musicRepository: IMusicRepository<Music>,
    @inject('GenreRepository') genreRepository: IGenreRepository<Genre>,
    @inject('OrchestraRepository') orchestraRepository: IOrchestraRepository<Orchestra>,
    @inject('PeriodRepository') periodRepository: IPeriodRepository<Period>,
    @inject('InstrumentRepository') instrumentRepository: IInstrumentRepository<Instrument>,
    @inject('ArtistStudentRepository') artistStudentRepository: IArtistStudentRepository<ArtistStudent>
  ) {
    super(artistRepository);
    this.artistRepository = artistRepository;
    this.musicRepository = musicRepository;
    this.genreRepository = genreRepository;
    this.orchestraRepository = orchestraRepository;
    this.periodRepository = periodRepository;
    this.instrumentRepository = instrumentRepository;
    this.artistStudentRepository = artistStudentRepository;
  }

  async getById(id: number): Promise<ArtistDetailRes | null> {
    const artistDetail = await this.artistRepository.findOne({
      filter: {
        id: id
      },
      relations: ['genres', 'orchestras', 'periods', 'musicsComposed', 'musics', 'instruments'],
      select: {
        id: true,
        name: true,
        description: true,
        picture: true,
        awardsAndHonors: true,
        nationality: true,
        teachingAndAcademicContributions: true,
        significantPerformences: true,
        roles: true,
        dateOfBirth: true,
        dateOfDeath: true,
        genres: true,
        orchestras: true,
        periods: true,
        instruments: true
      }
    });

    if (!artistDetail) {
      return null;
    }

    // Get music of the artist
    const musics = await this.musicRepository.findApprovedMusicsByArtistId(artistDetail.id);

    const musicsComposed = await this.musicRepository.findApprovedMusicsComposedByArtistId(artistDetail.id);

    artistDetail.musics = musics;
    artistDetail.musicsComposed = musicsComposed;

    const artistStudents = await this.artistStudentRepository.findMany({
      filter: {
        teacherId: artistDetail.id
      },
      relations: ['student'],
      select: {
        id: true,
        student: {
          id: true,
          name: true,
          description: true,
          picture: true
        }
      }
    });
    artistDetail.artistStudents = artistStudents;

    return artistDetail as ArtistDetailRes;
  }

  private convertOrchestraIdsToOrchestras(orchestraIds: number[]): Orchestra[] {
    const orchestras = new Array<Orchestra>();

    for (const orchestraId of orchestraIds) {
      const orchestra = new Orchestra();
      orchestra.id = orchestraId;
      orchestras.push(orchestra);
    }

    return orchestras;
  }

  private convertPeriodIdsToPeriods(periodIds: number[]): Period[] {
    const periods = new Array<Period>();

    for (const periodId of periodIds) {
      const period = new Period();
      period.id = periodId;
      periods.push(period);
    }

    return periods;
  }

  private convertInstrumentIdsToInstruments(instrumentIds: number[]): Instrument[] {
    const instruments = new Array<Instrument>();

    for (const instrumentId of instrumentIds) {
      const instrument = new Instrument();
      instrument.id = instrumentId;
      instruments.push(instrument);
    }

    return instruments;
  }

  private convertArtistStudentIdsToArtistStudents(studentIds: number[], teacherId: number): ArtistStudent[] {
    const artistStudents = new Array<ArtistStudent>();
    for (const studentId of studentIds) {
      const artistStudent = new ArtistStudent();
      artistStudent.studentId = studentId;
      artistStudent.teacherId = teacherId;
      artistStudents.push(artistStudent);
    }

    return artistStudents;
  }

  private convertGenreIdsToGenres(genreIds: number[]): Genre[] {
    const genres = new Array<Genre>();

    for (const genreId of genreIds) {
      const genre = new Genre();
      genre.id = genreId;
      genres.push(genre);
    }

    return genres;
  }

  async createNew(artistCreateReq: ArtistCreateReq): Promise<number> {
    let artistStudents = new Array<ArtistStudent>();
    let periods = new Array<Period>();
    let orchestras = new Array<Orchestra>();
    let genres = new Array<Genre>();
    let instruments = new Array<Instrument>();

    if (artistCreateReq.periodIds && artistCreateReq.periodIds.length > 0) {
      periods = this.convertPeriodIdsToPeriods(artistCreateReq.periodIds);
    }

    if (artistCreateReq.orchestraIds && artistCreateReq.orchestraIds.length > 0) {
      orchestras = this.convertOrchestraIdsToOrchestras(artistCreateReq.orchestraIds);
    }

    if (artistCreateReq.genreIds && artistCreateReq.genreIds.length > 0) {
      genres = this.convertGenreIdsToGenres(artistCreateReq.genreIds);
    }

    if (artistCreateReq.instrumentIds && artistCreateReq.instrumentIds.length > 0) {
      instruments = this.convertInstrumentIdsToInstruments(artistCreateReq.instrumentIds);
    }

    let artist = new Artist();
    artist = artistCreateReq as unknown as Artist;

    artist.periods = periods;
    artist.orchestras = orchestras;
    artist.genres = genres;
    artist.instruments = instruments;

    // Create artist
    const createdArtist = await this.artistRepository.create({
      data: artist
    });

    // Create artist students
    if (artistCreateReq.artistStudentIds && artistCreateReq.artistStudentIds.length > 0) {
      artistStudents = this.convertArtistStudentIdsToArtistStudents(artistCreateReq.artistStudentIds, createdArtist.id);

      for (const artistStudent of artistStudents) {
        await this.artistStudentRepository.create({
          data: artistStudent
        });
      }
    }

    return createdArtist.id;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<Artist>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const artists = await this.artistRepository.findMany({
      filter: where,
      order: order,
      relations: ['genres', 'orchestras', 'periods', 'instruments'],
      select: {
        genres: {
          id: true,
          name: true,
          picture: true
        },
        orchestras: {
          id: true,
          name: true,
          picture: true
        },
        periods: {
          id: true,
          name: true,
          picture: true
        },
        instruments: {
          id: true,
          name: true,
          picture: true
        }
      },
      paging: paging
    });

    const total = await this.artistRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, artists);
  }
  async updateById(id: number, artistUpdateReq: ArtistUpdateReq): Promise<void> {
    let artistStudents = new Array<ArtistStudent>();
    const periods = new Array<Period>();
    const orchestras = new Array<Orchestra>();
    const genres = new Array<Genre>();
    const instruments = new Array<Instrument>();

    // Get the artist by id
    const artist = await this.artistRepository.findOne({
      filter: {
        id: id
      }
    });

    // Check if the artist exists
    // If not, throw an error
    if (!artist) {
      throw new DefinedError(ArtistUpdateException.ARTIST_UPDATE_NotFound);
    }

    if (artistUpdateReq.periodIds) {
      for (const periodId of artistUpdateReq.periodIds) {
        const period = await this.periodRepository.findOne({
          filter: {
            id: periodId
          }
        });
        periods.push(period!);
      }
      artist.periods = periods;
    }

    if (artistUpdateReq.orchestraIds) {
      for (const orchestraId of artistUpdateReq.orchestraIds) {
        const orchestra = await this.orchestraRepository.findOne({
          filter: {
            id: orchestraId
          }
        });
        orchestras.push(orchestra!);
      }

      artist.orchestras = orchestras;
    }

    if (artistUpdateReq.genreIds) {
      for (const genreId of artistUpdateReq.genreIds) {
        const genre = await this.genreRepository.findOne({
          filter: {
            id: genreId
          }
        });
        genres.push(genre!);
      }

      artist.genres = genres;
    }

    if (artistUpdateReq.instrumentIds) {
      for (const instrumentId of artistUpdateReq.instrumentIds) {
        const instrument = await this.instrumentRepository.findOne({
          filter: {
            id: instrumentId
          }
        });
        instruments.push(instrument!);
      }

      artist.instruments = instruments;
    }

    if (artistUpdateReq.artistStudentIds) {
      artistStudents = this.convertArtistStudentIdsToArtistStudents(artistUpdateReq.artistStudentIds, id);

      // Delete the old artist students
      await this.artistStudentRepository.hardDeleteByTeacherId(id);

      artist.artistTeachers = artistStudents;
    }

    delete artistUpdateReq.periodIds;
    delete artistUpdateReq.orchestraIds;
    delete artistUpdateReq.genreIds;
    delete artistUpdateReq.instrumentIds;
    delete artistUpdateReq.artistStudentIds;

    // Set the properties of the artist
    const updatedData = { ...artist, ...artistUpdateReq };

    // Update the artist
    await this.artistRepository.save(updatedData as Artist);
  }
}
