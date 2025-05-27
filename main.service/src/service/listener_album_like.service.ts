import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { ListenerAlbumLike } from '@/models/listener_album_like.model';
import { AlbumRepository } from '@/repository/album.repository';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { IListenerAlbumLikeRepository } from '@/repository/interface/i.listener_album_like.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IListenerAlbumLikeService } from '@/service/interface/i.listener_album_like.service';
import { SearchUtil } from '@/utils/search/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class ListenerAlbumLikeService
  extends BaseCrudService<ListenerAlbumLike>
  implements IListenerAlbumLikeService<ListenerAlbumLike>
{
  private listenerAlbumLikeRepository: IListenerAlbumLikeRepository<ListenerAlbumLike>;
  private albumRepository: IAlbumRepository<AlbumRepository>;

  constructor(
    @inject('ListenerAlbumLikeRepository') listenerAlbumLikeRepository: IListenerAlbumLikeRepository<ListenerAlbumLike>,
    @inject('AlbumRepository') albumRepository: IAlbumRepository<AlbumRepository>
  ) {
    super(listenerAlbumLikeRepository);
    this.listenerAlbumLikeRepository = listenerAlbumLikeRepository;
    this.albumRepository = albumRepository;
  }

  async likeAlbum(albumId: number, listenerId: number): Promise<void> {
    await this.listenerAlbumLikeRepository.create({ data: { albumId, listenerId } });

    // Update the music's favorite count
    this.albumRepository.increaseLikeCount(albumId);
  }

  async unLikeAlbum(albumId: number, listenerId: number): Promise<void> {
    await this.listenerAlbumLikeRepository.findOneAndDelete({
      filter: {
        albumId: albumId,
        listenerId: listenerId
      }
    });

    // Update the music's favorite count
    this.albumRepository.decreaseLikeCount(albumId);
  }

  async myLikedAlbums(listenerId: number, searchData: SearchDataDto): Promise<PagingResponseDto<ListenerAlbumLike>> {
    const { order, paging } = SearchUtil.getWhereCondition(searchData);

    const likedAlbums = await this.listenerAlbumLikeRepository.findMany({
      filter: {
        listenerId: listenerId
      },
      order: order,
      paging: paging,
      relations: ['album']
    });

    const total = await this.listenerAlbumLikeRepository.count({
      filter: {
        listenerId: listenerId
      }
    });

    return new PagingResponseDto(total, likedAlbums);
  }
}
