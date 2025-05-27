import { MusicSearchRes } from '@/dto/music/response/music-search.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { FavoriteList } from '@/models/favorite_list.model';
import { Music } from '@/models/music.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IFavoriteListService<T extends BaseModelType> extends IBaseCrudService<T> {
  addToFavoriteList(musicId: number, listenerId: number): Promise<void>;
  myFavoriteList(listenerId: number, searchData: SearchDataDto): Promise<PagingResponseDto<FavoriteList>>;
  removeFromFavoriteList(musicId: number, listenerId: number): Promise<void>;
}
