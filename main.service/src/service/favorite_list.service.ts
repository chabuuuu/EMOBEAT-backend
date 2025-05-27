import { MusicSearchRes } from '@/dto/music/response/music-search.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { InteractTypeEnum } from '@/enums/interact-type.enum';
import { FavoriteList } from '@/models/favorite_list.model';
import { ListenerMusicRecommendScore } from '@/models/listener_music_recommend_score.model';
import { Music } from '@/models/music.model';
import { IFavoriteListRepository } from '@/repository/interface/i.favorite_list.repository';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IFavoriteListService } from '@/service/interface/i.favorite_list.service';
import { IListenerMusicRecommendScoreService } from '@/service/interface/i.listener_music_recommend_score.service';
import { SearchUtil } from '@/utils/search/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class FavoriteListService extends BaseCrudService<FavoriteList> implements IFavoriteListService<FavoriteList> {
  private favoriteListRepository: IFavoriteListRepository<FavoriteList>;
  private musicRepository: IMusicRepository<Music>;
  private listenerMusicRecommendScoreService: IListenerMusicRecommendScoreService<ListenerMusicRecommendScore>;

  constructor(
    @inject('FavoriteListRepository') favoriteListRepository: IFavoriteListRepository<FavoriteList>,
    @inject('MusicRepository') musicRepository: IMusicRepository<Music>,
    @inject('ListenerMusicRecommendScoreService')
    listenerMusicRecommendScoreService: IListenerMusicRecommendScoreService<ListenerMusicRecommendScore>
  ) {
    super(favoriteListRepository);
    this.favoriteListRepository = favoriteListRepository;
    this.musicRepository = musicRepository;
    this.listenerMusicRecommendScoreService = listenerMusicRecommendScoreService;
  }

  async myFavoriteList(listenerId: number, searchData: SearchDataDto): Promise<PagingResponseDto<FavoriteList>> {
    const { order, paging } = SearchUtil.getWhereCondition(searchData);

    const favoriteLists = await this.favoriteListRepository.findMany({
      filter: {
        listenerId: listenerId
      },
      order: order,
      paging: paging,
      relations: ['music', 'music.genres', 'music.instruments', 'music.categories', 'music.artists'],
      select: {
        music: {
          id: true,
          name: true,
          coverPhoto: true,
          createAt: true,
          updateAt: true,
          albums: {
            id: true,
            name: true
          },
          genres: {
            id: true,
            name: true
          },
          instruments: {
            id: true,
            name: true
          },
          categories: {
            id: true,
            name: true
          },
          artists: {
            id: true,
            name: true
          }
        }
      }
    });

    const total = await this.favoriteListRepository.count({
      filter: {
        listenerId: listenerId
      }
    });

    return new PagingResponseDto(total, favoriteLists);
  }

  async addToFavoriteList(musicId: number, listenerId: number): Promise<void> {
    await this.favoriteListRepository.create({
      data: {
        musicId: musicId,
        listenerId: listenerId
      }
    });

    // Update the music's favorite count
    this.musicRepository.increaseFavoriteCount(musicId);

    // Update the listener's music recommendation score
    this.listenerMusicRecommendScoreService.interact(musicId, listenerId, InteractTypeEnum.LIKE);
  }

  async removeFromFavoriteList(musicId: number, listenerId: number): Promise<void> {
    await this.favoriteListRepository.findOneAndDelete({
      filter: {
        musicId: musicId,
        listenerId: listenerId
      }
    });

    // Update the music's favorite count
    this.musicRepository.decreaseFavoriteCount(musicId);
  }
}
