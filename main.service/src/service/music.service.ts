import { MusicCreateReq } from '@/dto/music/request/music-create.req';
import { MusicUpdateReq } from '@/dto/music/request/music-update.req';
import { MusicDetailRes } from '@/dto/music/response/music-detail.res';
import { MusicQuickSearchRes } from '@/dto/music/response/music-quick-search.res';
import { MusicSearchRes } from '@/dto/music/response/music-search.res';
import { MusicSearchSelect } from '@/dto/music/select/music-search.select';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { MusicGetByIdException } from '@/exceptions/music/music-get-by-id.exception';
import { MusicUpdateException } from '@/exceptions/music/music-update.exception';
import { Album } from '@/models/album.model';
import { Artist } from '@/models/artist.model';
import { Category } from '@/models/category.model';
import { Genre } from '@/models/genre.model';
import { Instrument } from '@/models/instrument.model';
import { Music } from '@/models/music.model';
import { Period } from '@/models/period.model';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { ICategoryRepository } from '@/repository/interface/i.category.repository';
import { IGenreRepository } from '@/repository/interface/i.genre.repository';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMusicService } from '@/service/interface/i.music.service';
import { convertIdsToModels } from '@/utils/dto-convert/convert-id-to-model.util';
import DefinedError from '@/utils/error/defined.error';
import { SearchUtil } from '@/utils/search/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class MusicService extends BaseCrudService<Music> implements IMusicService<Music> {
  private musicRepository: IMusicRepository<Music>;
  private genreRepository: IGenreRepository<Genre>;
  private albumRepository: IAlbumRepository<Album>;
  private artistRepository: IArtistRepository<Artist>;
  private instrumentRepository: IInstrumentRepository<Instrument>;
  private periodRepository: IPeriodRepository<Period>;
  private categoryRepository: ICategoryRepository<Category>;

  constructor(
    @inject('MusicRepository') musicRepository: IMusicRepository<Music>,
    @inject('GenreRepository') genreRepository: IGenreRepository<Genre>,
    @inject('AlbumRepository') albumRepository: IAlbumRepository<Album>,
    @inject('ArtistRepository') artistRepository: IArtistRepository<Artist>,
    @inject('InstrumentRepository') instrumentRepository: IInstrumentRepository<Instrument>,
    @inject('PeriodRepository') periodRepository: IPeriodRepository<Period>,
    @inject('CategoryRepository') categoryRepository: ICategoryRepository<Category>
  ) {
    super(musicRepository);
    this.musicRepository = musicRepository;
    this.genreRepository = genreRepository;
    this.albumRepository = albumRepository;
    this.artistRepository = artistRepository;
    this.instrumentRepository = instrumentRepository;
    this.periodRepository = periodRepository;
    this.categoryRepository = categoryRepository;
  }

  async quickSearch(searchData: SearchDataDto): Promise<PagingResponseDto<MusicQuickSearchRes>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const musics = await this.musicRepository.findMany({
      filter: where,
      order: order,
      paging: paging,
      select: {
        id: true,
        name: true,
        createAt: true,
        updateAt: true
      }
    });

    const total = await this.musicRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, musics);
  }

  private getMusicModelFromReq(req: any): Music {
    let genres = new Array<Genre>();
    let instruments = new Array<Instrument>();
    let periods = new Array<Period>();
    let categories = new Array<Category>();
    let artists = new Array<Artist>();
    let composerIds = new Array<Artist>();
    let albums = new Array<Album>();
    const music = new Music();

    // Convert ids to models
    if (req.genreIds && req.genreIds.length > 0) {
      genres = convertIdsToModels<Genre>(req.genreIds, Genre);

      music.genres = genres;
    }

    if (req.instrumentIds && req.instrumentIds.length > 0) {
      instruments = convertIdsToModels<Instrument>(req.instrumentIds, Instrument);

      music.instruments = instruments;
    }

    if (req.periodIds && req.periodIds.length > 0) {
      periods = convertIdsToModels<Period>(req.periodIds, Period);

      music.periods = periods;
    }

    if (req.categoryIds && req.categoryIds.length > 0) {
      categories = convertIdsToModels<Category>(req.categoryIds, Category);

      music.categories = categories;
    }

    if (req.artistIds && req.artistIds.length > 0) {
      artists = convertIdsToModels<Artist>(req.artistIds, Artist);

      music.artists = artists;
    }

    if (req.composerIds && req.composerIds.length > 0) {
      composerIds = convertIdsToModels<Artist>(req.composerIds, Artist);

      music.composers = composerIds;
    }

    if (req.albumIds && req.albumIds.length > 0) {
      albums = convertIdsToModels<Album>(req.albumIds, Album);

      music.albums = albums;
    }

    // Set other properties
    music.name = req.name;
    music.description = req.description;
    music.lyric = req.lyric;
    music.coverPhoto = req.coverPhoto;
    music.resourceLink = req.resourceLink;

    return music;
  }

  async createNew(musicCreateReq: MusicCreateReq): Promise<number> {
    const music = this.getMusicModelFromReq(musicCreateReq);

    // Create new music
    const newMusic = await this.musicRepository.create({
      data: music
    });

    return newMusic.id;
  }

  async updateById(id: number, musicUpdateReq: MusicUpdateReq): Promise<void> {
    // Get the music model from the request
    const music = this.getMusicModelFromReq(musicUpdateReq);

    const genres = new Array<Genre>();
    const instruments = new Array<Instrument>();
    const periods = new Array<Period>();
    const categories = new Array<Category>();
    const artists = new Array<Artist>();
    const composerIds = new Array<Artist>();
    const albums = new Array<Album>();

    if (musicUpdateReq.genreIds && musicUpdateReq.genreIds.length > 0) {
      for (const genreId of musicUpdateReq.genreIds) {
        const genre = await this.genreRepository.findOne({
          filter: {
            id: genreId
          }
        });

        if (!genre) {
          throw new Error(`Genre with id ${genreId} not found`);
        }

        genres.push(genre);
      }
      music.genres = genres;
    }

    if (musicUpdateReq.instrumentIds && musicUpdateReq.instrumentIds.length > 0) {
      for (const instrumentId of musicUpdateReq.instrumentIds) {
        const instrument = await this.instrumentRepository.findOne({
          filter: {
            id: instrumentId
          }
        });

        if (!instrument) {
          throw new Error(`Instrument with id ${instrumentId} not found`);
        }

        instruments.push(instrument);
      }

      music.instruments = instruments;
    }

    if (musicUpdateReq.periodIds && musicUpdateReq.periodIds.length > 0) {
      for (const periodId of musicUpdateReq.periodIds) {
        const period = await this.periodRepository.findOne({
          filter: {
            id: periodId
          }
        });

        if (!period) {
          throw new Error(`Period with id ${periodId} not found`);
        }

        periods.push(period);
      }

      music.periods = periods;
    }

    if (musicUpdateReq.categoryIds && musicUpdateReq.categoryIds.length > 0) {
      for (const categoryId of musicUpdateReq.categoryIds) {
        const category = await this.categoryRepository.findOne({
          filter: {
            id: categoryId
          }
        });

        if (!category) {
          throw new Error(`Category with id ${categoryId} not found`);
        }

        categories.push(category);
      }

      music.categories = categories;
    }

    if (musicUpdateReq.artistIds && musicUpdateReq.artistIds.length > 0) {
      for (const artistId of musicUpdateReq.artistIds) {
        const artist = await this.artistRepository.findOne({
          filter: {
            id: artistId
          }
        });

        if (!artist) {
          throw new Error(`Artist with id ${artistId} not found`);
        }

        artists.push(artist);
      }

      music.artists = artists;
    }

    if (musicUpdateReq.composerIds && musicUpdateReq.composerIds.length > 0) {
      for (const composerId of musicUpdateReq.composerIds) {
        const composer = await this.artistRepository.findOne({
          filter: {
            id: composerId
          }
        });

        if (!composer) {
          throw new Error(`Composer with id ${composerId} not found`);
        }

        composerIds.push(composer);
      }

      music.composers = composerIds;
    }

    if (musicUpdateReq.albumIds && musicUpdateReq.albumIds.length > 0) {
      for (const albumId of musicUpdateReq.albumIds) {
        const album = await this.albumRepository.findOne({
          filter: {
            id: albumId
          }
        });

        if (!album) {
          throw new Error(`Album with id ${albumId} not found`);
        }

        albums.push(album);
      }

      music.albums = albums;
    }

    const musicToUpdate = await this.musicRepository.findOne({
      filter: {
        id: id
      },
      relations: ['albums', 'genres', 'instruments', 'periods', 'categories', 'artists', 'composers']
    });

    if (!musicToUpdate) {
      throw new DefinedError(MusicUpdateException.MUSIC_UPDATE_NotFound);
    }

    const updatedData = { ...musicToUpdate, ...music };

    console.log('musicData', updatedData);

    // Save the changes
    await this.musicRepository.save(updatedData as Music);
  }

  async getById(id: number): Promise<MusicDetailRes> {
    const music = await this.musicRepository.findOne({
      filter: {
        id: id
      },
      relations: ['albums', 'genres', 'instruments', 'periods', 'categories', 'artists', 'composers'],
      select: {
        id: true,
        name: true,
        description: true,
        lyric: true,
        coverPhoto: true,
        resourceLink: true,
        favoriteCount: true,
        listenCount: true,
        createAt: true,
        updateAt: true,
        albums: {
          id: true,
          name: true
        },
        genres: true,
        instruments: true,
        periods: true,
        categories: true,
        artists: true,
        composers: true
      }
    });

    if (!music) {
      throw new DefinedError(MusicGetByIdException.MUSIC_GET_BY_ID_NotFound);
    }

    return music;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<MusicSearchRes>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const musics = await this.musicRepository.findMany({
      filter: where,
      order: order,
      paging: paging,
      relations: ['albums', 'genres', 'instruments', 'periods', 'categories', 'artists', 'composers'],
      select: MusicSearchSelect
    });

    const total = await this.musicRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, musics);
  }
}
