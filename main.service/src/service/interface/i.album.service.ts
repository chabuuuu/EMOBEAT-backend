import { AlbumCreateReq } from '@/dto/album/request/album-create.req';
import { AlbumUpdateReq } from '@/dto/album/request/album-update.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Album } from '@/models/album.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';

export interface IAlbumService<T> extends IBaseCrudService<T> {
  /**
   * Update album by id
   * @param id
   * @param albumUpdateReq
   */
  updateById(id: number, albumUpdateReq: AlbumUpdateReq, adminId: number): Promise<void>;
  /**
   * Create album
   * @param albumCreateReq
   */
  createNew(albumCreateReq: AlbumCreateReq, adminId: number): Promise<number>;

  /**
   * Search listener
   * @param searchData
   */
  search(searchData: SearchDataDto): Promise<PagingResponseDto<Album>>;
}
