import { AlbumCreateReq } from '@/dto/album/request/album-create.req';
import { AlbumUpdateReq } from '@/dto/album/request/album-update.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { AlbumCreateException } from '@/exceptions/album/album-create.exception';
import { AlbumUpdateException } from '@/exceptions/album/album-update.exception';
import { Admin } from '@/models/admin.model';
import { Album } from '@/models/album.model';
import { Genre } from '@/models/genre.model';
import { Music } from '@/models/music.model';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IAlbumService } from '@/service/interface/i.album.service';
import DefinedError from '@/utils/error/defined.error';
import { SearchUtil } from '@/utils/search/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class AlbumService extends BaseCrudService<Album> implements IAlbumService<Album> {
  private albumRepository: IAlbumRepository<Album>;
  private adminRepository: IAdminRepository<Admin>;

  constructor(
    @inject('AlbumRepository') albumRepository: IAlbumRepository<Album>,
    @inject('AdminRepository') adminRepository: IAdminRepository<Admin>
  ) {
    super(albumRepository);
    this.albumRepository = albumRepository;
    this.adminRepository = adminRepository;
  }

  private convertMusicIdsToMusics(musicIds: number[]): Music[] {
    const musics = new Array<Music>();

    for (const musicId of musicIds) {
      const musicItem = new Music();
      musicItem.id = musicId;
      musics.push(musicItem);
    }

    return musics;
  }

  private convertGenreIdsToGenres(genreIds: number[]): Genre[] {
    const genres = new Array<Genre>();

    for (const genreId of genreIds) {
      const genere = new Genre();
      genere.id = genreId;
      genres.push(genere);
    }

    return genres;
  }

  async updateById(id: number, albumUpdateReq: AlbumUpdateReq, adminId: number): Promise<void> {
    let generes = new Array<Genre>();
    let musics = new Array<Music>();

    // Get admin by id
    const admin = await this.adminRepository.findOne({
      filter: {
        id: adminId
      }
    });

    // Check if admin exists
    // If not, throw an error
    if (!admin) {
      throw new DefinedError(AlbumUpdateException.ALBUM_UPDATE_AdminNotFound);
    }

    const album = await this.albumRepository.findOne({
      filter: {
        id: id
      }
    });

    // Check if album exists
    // If not, throw an error
    if (!album) {
      throw new DefinedError(AlbumUpdateException.ALBUM_UPDATE_AlbumNotFound);
    }

    // Convert genreIds and musicIds to Genre and Music objects
    if (albumUpdateReq.genreIds && albumUpdateReq.genreIds.length > 0) {
      generes = this.convertGenreIdsToGenres(albumUpdateReq.genreIds);
    }

    if (albumUpdateReq.musicIds && albumUpdateReq.musicIds.length > 0) {
      musics = this.convertMusicIdsToMusics(albumUpdateReq.musicIds);
    }

    // Set album properties
    album.name = albumUpdateReq.name ? albumUpdateReq.name : album.name;
    album.coverPhoto = albumUpdateReq.coverPhoto ? albumUpdateReq.coverPhoto : album.coverPhoto;
    album.releaseDate = albumUpdateReq.releaseDate ? albumUpdateReq.releaseDate : album.releaseDate;
    album.albumType = albumUpdateReq.albumType ? albumUpdateReq.albumType : album.albumType;
    album.description = albumUpdateReq.description ? albumUpdateReq.description : album.description;
    album.genres = generes ? generes : album.genres;
    album.musics = musics ? musics : album.musics;

    // Save the album to the database
    await this.albumRepository.save(album);
  }

  async createNew(albumCreateReq: AlbumCreateReq, adminId: number): Promise<number> {
    let generes = new Array<Genre>();
    let musics = new Array<Music>();
    const album = new Album();

    // Get admin by id
    const admin = await this.adminRepository.findOne({
      filter: {
        id: adminId
      }
    });

    // Check if admin exists
    // If not, throw an error
    if (!admin) {
      throw new DefinedError(AlbumCreateException.ALBUM_CREATE_AdminNotFound);
    }

    // Set createdBy to the admin who created the album
    album.createdBy = admin;

    // Convert genreIds and musicIds to Genre and Music objects
    if (albumCreateReq.genreIds && albumCreateReq.genreIds.length > 0) {
      generes = this.convertGenreIdsToGenres(albumCreateReq.genreIds);
    }

    if (albumCreateReq.musicIds && albumCreateReq.musicIds.length > 0) {
      musics = this.convertMusicIdsToMusics(albumCreateReq.musicIds);
    }

    // Set album properties
    album.name = albumCreateReq.name;
    album.coverPhoto = albumCreateReq.coverPhoto;
    album.releaseDate = albumCreateReq.releaseDate;
    album.albumType = albumCreateReq.albumType;
    album.description = albumCreateReq.description;
    album.genres = generes;
    album.musics = musics;

    // Save the album to the database
    const createdAlbum = await this.albumRepository.create({
      data: album
    });

    // Return the id of the created album
    return createdAlbum.id;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<Album>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const albums = await this.albumRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.albumRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, albums);
  }
}
