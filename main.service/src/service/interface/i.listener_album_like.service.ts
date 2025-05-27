import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { ListenerAlbumLike } from '@/models/listener_album_like.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IListenerAlbumLikeService<T extends BaseModelType> extends IBaseCrudService<T> {
  likeAlbum(albumId: number, listenerId: number): Promise<void>;
  myLikedAlbums(listenerId: number, searchData: SearchDataDto): Promise<PagingResponseDto<ListenerAlbumLike>>;
  unLikeAlbum(albumId: number, listenerId: number): Promise<void>;
}
