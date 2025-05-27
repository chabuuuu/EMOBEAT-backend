import { ErasAndStylesRes } from '@/dto/recommender/response/eras-and-styles.res';
import { InstrumentSpotlightRes } from '@/dto/recommender/response/instrument-spotlight.res';
import { Album } from '@/models/album.model';
import { Artist } from '@/models/artist.model';
import { Music } from '@/models/music.model';

export interface IRecommenderService {
  getRecommendedSongs(listenerId: number, topN: number): Promise<Music[]>;
  getRecommendedSongsExclude(listenerId: number, topN: number, excludeMusicIds: number[]): Promise<Music[]>;
  getPopularAlbums(listenerId: number, topN: number): Promise<Album[]>;
  getTopArtistToday(topN: number): Promise<Artist[]>;
  getInstrumentSpotlight(topN: number): Promise<InstrumentSpotlightRes[]>;
  getErasAndStyles(listenerId: number, topN: number): Promise<ErasAndStylesRes[]>;
  getRandomArtist(): Promise<Artist>;
}
