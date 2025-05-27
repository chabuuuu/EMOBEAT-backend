import { MusicCreateReq } from '@/dto/music/request/music-create.req';
import { MusicUpdateReq } from '@/dto/music/request/music-update.req';
import { MusicDetailRes } from '@/dto/music/response/music-detail.res';
import { MusicQuickSearchRes } from '@/dto/music/response/music-quick-search.res';
import { MusicSearchRes } from '@/dto/music/response/music-search.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMusicService<T extends BaseModelType> extends IBaseCrudService<T> {
  /**
   * Create new music
   * @param musicCreateReq
   */
  createNew(musicCreateReq: MusicCreateReq): Promise<number>;

  /**
   * Update music by id
   * @param id Music id
   * @param musicUpdateReq Update request
   * @param makeChangeUser User who made the change
   */
  updateById(id: number, musicUpdateReq: MusicUpdateReq): Promise<void>;

  /**
   * Get music by id
   * @param id Music id
   */
  getById(id: number): Promise<MusicDetailRes>;

  /**
   * Search musics
   * @param searchData
   */
  search(searchData: SearchDataDto): Promise<PagingResponseDto<MusicSearchRes>>;

  quickSearch(searchData: SearchDataDto): Promise<PagingResponseDto<MusicQuickSearchRes>>;
}
