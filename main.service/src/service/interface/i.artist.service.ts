import { ArtistCreateReq } from '@/dto/artist/request/artist-create.req';
import { ArtistUpdateReq } from '@/dto/artist/request/artist-update.req';
import { ArtistDetailRes } from '@/dto/artist/response/artist-detail.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Artist } from '@/models/artist.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IArtistService<T extends BaseModelType> extends IBaseCrudService<T> {
  /**
   * Create artist
   * @param artistCreateReq
   */
  createNew(artistCreateReq: ArtistCreateReq): Promise<number>;

  /**
   * Search artist
   * @param searchData
   */
  search(searchData: SearchDataDto): Promise<PagingResponseDto<Artist>>;

  /**
   * Update artist by id
   * @param id
   * @param artistUpdateReq
   */
  updateById(id: number, artistUpdateReq: ArtistUpdateReq): Promise<void>;

  /**
   *
   * @param id
   */
  getById(id: number): Promise<ArtistDetailRes | null>;
}
