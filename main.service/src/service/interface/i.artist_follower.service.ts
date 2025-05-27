import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { ArtistFollower } from '@/models/artist_follower.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IArtistFollowerService<T extends BaseModelType> extends IBaseCrudService<T> {
  followArtist(artistId: number, listenerId: number): Promise<void>;
  myFollowedArtists(listenerId: number, searchData: SearchDataDto): Promise<PagingResponseDto<ArtistFollower>>;
  unFollowArtist(artistId: number, listenerId: number): Promise<void>;
}
